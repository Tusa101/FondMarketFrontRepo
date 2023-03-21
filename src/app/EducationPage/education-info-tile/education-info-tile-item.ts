import { Themes } from "../Themes";

export class ThemeItem{
    public title: Themes;
    public hotKey: string[]
    public tooltip: string;
    public imagePath: string;
    public activeLevels: number[];

    constructor(){
    }
}