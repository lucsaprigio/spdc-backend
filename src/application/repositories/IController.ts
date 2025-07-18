export interface IController<TRequest, TResponse> {
    handle(request: TRequest): Promise<TResponse | null>;
}