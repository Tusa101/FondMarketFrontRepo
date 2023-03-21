import { ThemeItem } from "./EducationPage/education-info-tile/education-info-tile-item";
import { Injectable } from '@angular/core';
import { LevelItem } from "./levelBar/level-item";
import { Themes } from "./EducationPage/Themes";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(httpClient: HttpClient) {
    }

    public get infoTileList(): ThemeItem[] {
        return this.themeList;
    }

    public getInfoTextParts(): string {  //TODO: Need new Object for InfoTextPart
        return "";
    }

    private trancferTileJson() {

    }

    private trancferInfoTextJson() {

    }

    public getLevelsByTheme(): LevelItem[] {
        return [];
    }

    public getHotKey(): LevelItem[] {
        return this.themeList[0].hotKey.map(item => {
            return { title: item }
        });
    }

    public getFullThemeText(theme: Themes, levels: number[]): string {
        return this.textSections.filter(
            section => section.availableTheme === theme || Themes.All
                && section.availableLevels.map(availableLevel => levels.some(level => availableLevel === level))  //REWORK!!!!!!!!!!!!!
        ).map(item => item.sectionText).join(" ");
    }

    // <--------------------TEST DATA------------------>
    private themeList: ThemeItem[] = [
        { title: Themes.theme1, tooltip: "", imagePath: "https://sun9-19.userapi.com/impg/FK4IZ3KUV9wZZIhKGgD3U6rjDuOyt4WtRUORLw/b6o4kgurx6s.jpg?size=251x251&quality=96&sign=1c5f41d24433e11d9f57677686b95057&type=album", hotKey: ["some", "body"], activeLevels: [1, 2, 3, 4, 5, 6, 7] },
        { title: Themes.theme2, tooltip: "", imagePath: "https://sun9-19.userapi.com/impg/FK4IZ3KUV9wZZIhKGgD3U6rjDuOyt4WtRUORLw/b6o4kgurx6s.jpg?size=251x251&quality=96&sign=1c5f41d24433e11d9f57677686b95057&type=album", hotKey: ["some", "body"], activeLevels: [1, 2, 3, 4, 5, 6, 7] }
    ];

    public levelList: LevelItem[] = [
        { title: 1 },
        { title: 2 },
        { title: 3 },
        { title: 4 },
        { title: 5 },
        { title: 6 },
        { title: 7 },
        { title: 8 },
        { title: 9 },
        { title: 10 },
        { title: 11 },
        { title: 12 },
        { title: 13 },
        { title: 14 },
        { title: 15 },
    ];

    public textSections: TextSection[] = [
        {
            availableLevels: [1, 3, 5],
            availableTheme: Themes.theme1,
            sectionText: "Some Text TUTUUTUTUTUTUUTUTUT"
        },
        {
            availableLevels: [1, 2, 6],
            availableTheme: Themes.theme1,
            sectionText: "Some Text TUTUUTUTUTUTUUTUTUT323232421412"
        }
    ]

    public text: string = "eqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeqeq"
    // <--------------------TEST DATA------------------>
}

export interface TextSection {
    availableLevels: number[];
    availableTheme: Themes;
    sectionText: string;
}