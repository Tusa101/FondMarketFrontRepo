import { InfoTileItem } from "./education-info-tile/education-info-tile-item";
import {} from '@angular/core';

export class DataService {
    private tileList: InfoTileItem[] = [
        {title: "", tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/342/342757.png"},
        {title: "", tooltip: "", imagePath: "https://cdn-icons-png.flaticon.com/512/342/342757.png"}
    ];
    private infoText: string = "";

    constructor(){
    }

    public get infoTileList(): InfoTileItem[]{
        return this.tileList;
    }

    private trancferTileJson() {
        this.tileList = [];
    }

    private trancferInfoTextJson() {
        this.infoText = "";
    }
}