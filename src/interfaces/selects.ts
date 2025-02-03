export interface SelectOption {
    value: string;
    text: string;
    img?:string
}

export interface SelectsValues {
    [key: string]: SelectOption[];
}

export interface SelectedValues {
    [key: string]: string;
}
