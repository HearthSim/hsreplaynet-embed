declare module "@awaitbox/document-ready" {
	export default function documentReady<T>(val?: T): Promise<T>;
}
