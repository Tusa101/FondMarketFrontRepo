import { Themes } from "../EducationPage/Themes";

export class LevelItem {
    public title: string = "";
    public themes: Themes[] = [];

    public isLevelContainsTheme(theme: Themes): boolean {
        return this.themes.some(item => item === theme);
    }
} 