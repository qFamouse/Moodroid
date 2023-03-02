export class Attempt {
    public attempt: number;
    public state: string[];
    public mark: number;
    public grade: number;
    public review: {
        isPermitted: boolean;
        href: string;
    };
}
