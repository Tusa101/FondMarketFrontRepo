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

    public get themesList(): ThemeItem[] {
        return this.themeList;
    }

    public getInfoTextParts(): string {//TODO: Need new Object for InfoTextPart
        return "";
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
            section =>
                section.availableTheme === theme
                && section.availableLevels.some(availableLevel => levels.some(level => availableLevel === level))//REWORK!!!!!!!!!!!!!
        ).map(item => item.sectionText).join(" ");
    }

    // <--------------------TEST DATA------------------>
    private themeList: ThemeItem[] = [
        { title: Themes.theme1, tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/74/74742.png", hotKey: ["some", "body"], activeLevels: [1, 2, 3, 5, 6,] },
        { title: Themes.theme2, tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/1742/1742983.png", hotKey: ["some", "body", "dsa", "dsa2"], activeLevels: [2, 3,] },
        { title: Themes.theme3, tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/10227/10227695.png", hotKey: ["some", "body"], activeLevels: [1,2,3,4,7,12,15] },
        { title: Themes.theme4, tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/2953/2953363.png", hotKey: ["some", "body"], activeLevels: [3, 4, 7] },
        { title: Themes.theme5, tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/2510/2510727.png", hotKey: ["some", "body"], activeLevels: [1, 2, 3, 4, 7, 10] }
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
        { title: 15 }
    ];

    public textSections: TextSection[] = [
        {
            availableLevels: [1],
            availableTheme: Themes.theme1,
            sectionText: "Ебать Саня!"
        },
        {
            availableLevels: [2],
            availableTheme: Themes.theme1,
            sectionText: "Не зря меня взяли, да?"
        },
        {
            availableLevels: [3],
            availableTheme: Themes.theme1,
            sectionText: "Да я знаю что я хорош)"
        },
        {
            availableLevels: [1, 2, 3],
            availableTheme: Themes.theme2,
            sectionText: "Как тебе)))"
        },
        {
            availableLevels: [1, 2, 3],
            availableTheme: Themes.theme3,
            sectionText: "Скажи же магия"
        }
    ]
    // <--------------------TEST DATA------------------>
}

export interface TextSection {
    availableLevels: number[];
    availableHotKeys?: string[];
    availableTheme: Themes;
    sectionText: string;
}