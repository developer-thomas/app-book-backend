export abstract class UseCase<TInput = any, TOutput = any> {
    abstract execute(data?: TInput): Promise<TOutput>
}