import { useEffect, useState } from "react";

const useHandheldDetector = (options?: {
	customBreakpoint?: number;
}): boolean => {
	const [isHandheld, setIsHandheld] = useState<boolean>(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(
			`(max-width: ${options?.customBreakpoint ? options.customBreakpoint : "1023"}px)`,
		);
		const handleMatch = (e: MediaQueryListEvent | MediaQueryList) => {
			setIsHandheld(e.matches);
		};

		handleMatch(mediaQuery);

		const mediaQueryListener = (e: MediaQueryListEvent | MediaQueryList) => {
			handleMatch(e);
		};

		mediaQuery.addEventListener("change", mediaQueryListener);

		return () => {
			mediaQuery.removeEventListener("change", mediaQueryListener);
		};
	}, []);

	return isHandheld;
};

export default useHandheldDetector;
