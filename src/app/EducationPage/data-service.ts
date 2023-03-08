import { InfoTileItem } from "./education-info-tile/education-info-tile-item";
import {} from '@angular/core';

export class DataService {
    private tileList: InfoTileItem[] = [
        {title: "", tooltip: "", imagePath: "https://sun9-19.userapi.com/impg/FK4IZ3KUV9wZZIhKGgD3U6rjDuOyt4WtRUORLw/b6o4kgurx6s.jpg?size=251x251&quality=96&sign=1c5f41d24433e11d9f57677686b95057&type=album"},
        {title: "", tooltip: "", imagePath: "https://sun9-19.userapi.com/impg/FK4IZ3KUV9wZZIhKGgD3U6rjDuOyt4WtRUORLw/b6o4kgurx6s.jpg?size=251x251&quality=96&sign=1c5f41d24433e11d9f57677686b95057&type=album"}
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