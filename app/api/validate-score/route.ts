import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { supabase } from '@/lib/supabase';

const SECRET_KEY = "mystic-realm-secret-2024-magic-defender";
const MAX_TIME_WINDOW = 5 * 60 * 1000; // 5 minutos

function generateTimeWindowHash(
  score: number,
  timestamp: number,
  clientId: string,
  gameData: any
): string {
  const dataToHash = [
    score.toString(),
    timestamp.toString(),
    clientId,
    SECRET_KEY,
    gameData?.wavesSurvived?.toString() || '',
    gameData?.crystalsEarned?.toString() || '',
    gameData?.gameStartTime?.toString() || '',
    gameData?.gameDuration?.toString() || '',
    gameData?.spellLevel?.toString() || '',
    gameData?.healthLevel?.toString() || ''
  ].join('|');

  return createHash('sha256').update(dataToHash).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      player_name,
      score,
      waves_survived,
      client_id,
      timestamp,
      time_window_hash,
      game_duration,
      crystals_earned,
      spell_level,
      health_level,
      game_start_time
    } = body;

    // Validación 1: Campos requeridos
    if (!player_name || !client_id || !time_window_hash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validación 2: Tiempo
    const now = Date.now();
    if (now - timestamp > MAX_TIME_WINDOW) {
      return NextResponse.json(
        { error: 'Score too old' },
        { status: 400 }
      );
    }

    // Validación 3: Hash de seguridad
    const gameData = {
      wavesSurvived: waves_survived,
      crystalsEarned: crystals_earned,
      gameStartTime: game_start_time,
      gameDuration: game_duration,
      spellLevel: spell_level,
      healthLevel: health_level
    };

    const expectedHash = generateTimeWindowHash(score, timestamp, client_id, gameData);
    if (expectedHash !== time_window_hash) {
      return NextResponse.json(
        { error: 'Invalid security hash' },
        { status: 403 }
      );
    }

    // Validación 4: Lógica del juego - Score realista
    const avgCreaturesPerWave = 5 + (waves_survived * 3); // Base + incremento
    const maxPossibleScore = avgCreaturesPerWave * waves_survived * 1.5; // Margen generoso
    if (score > maxPossibleScore) {
      return NextResponse.json(
        { error: 'Impossible score for waves survived' },
        { status: 400 }
      );
    }

    // Validación 5: Duración mínima del juego
    const minGameDuration = waves_survived * 20 * 1000; // 20 seg por wave mínimo
    if (game_duration < minGameDuration) {
      return NextResponse.json(
        { error: 'Game completed too fast' },
        { status: 400 }
      );
    }

    // Validación 6: Consistencia de upgrades
    const maxUpgrades = Math.floor(waves_survived / 2); // Aprox 1 upgrade cada 2 waves
    if (spell_level + health_level > maxUpgrades + 2) { // +2 de margen
      return NextResponse.json(
        { error: 'Too many upgrades for waves survived' },
        { status: 400 }
      );
    }

    // Validación 7: Rate limiting por client_id
    const { data: recentSubmissions } = await supabase
      .from('score_submissions')
      .select('*')
      .eq('client_id', client_id)
      .gte('submitted_at', new Date(now - 60000).toISOString());

    if (recentSubmissions && recentSubmissions.length >= 3) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait.' },
        { status: 429 }
      );
    }

    // Si pasa todas las validaciones, guardar el score
    const { error: scoreError } = await supabase
      .from('leaderboard')
      .insert({
        player_name,
        score,
        waves_survived,
        created_at: new Date(timestamp).toISOString()
      });

    if (scoreError) {
      console.error('Database error:', scoreError);
      return NextResponse.json(
        { error: 'Failed to save score' },
        { status: 500 }
      );
    }

    // Registrar la submission para rate limiting
    await supabase
      .from('score_submissions')
      .insert({
        client_id,
        ip_address: request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent')
      });

    return NextResponse.json({
      success: true,
      message: 'Score saved successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 