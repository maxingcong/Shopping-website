define("data/floor", ["base", "tools"], function ($, T) {
    var FloorConfig =  {
        tempCombList: [
            {
                tempCombId: 11,
                tempList: [101, 201]
            },
            {
                tempCombId: 12,
                tempList: [102, 201]
            },
            {
                tempCombId: 13,
                tempList: [103, 201]
            },
            {
                tempCombId: 14,
                tempList: [104, 202]
            },
            {
                tempCombId: 15,
                tempList: [105, 203]
            },
            {
                tempCombId: 16,
                tempList: [106, 204]
            },
            {
                tempCombId: 17,
                tempList: [107, 205]
            }
        ],
        tempList: [
            {
                tempId: 101,
                itemList: [2002, 2003, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 201,
                itemList: [1001, 1001, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 102,
                itemList: [2002, 2003, 1001, 1001, 1001, 1001, 2003]
            },
            {
                tempId: 103,
                itemList: [2002, 1001, 1001, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 104,
                itemList: [2003, 1001, 1001, 2002, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 202,
                itemList: [1001, 1001, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 105,
                itemList: [2004, 2003, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 203,
                itemList: [1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 106,
                itemList: [2003, 1001, 1001, 1001]
            },
            {
                tempId: 204,
                itemList: [1001, 1001, 1001]
            },
            {
                tempId: 107,
                itemList: [2001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 205,
                itemList: [1001, 1001, 1001, 1001]
            }
        ],
        itemList: [
            {
                "itemCode": 1001,
                "itemType": 0,
                "width": 236,
                "height": 236
            },
            {
                "itemCode": 2001,
                "itemType": 1,
                "width": 236,
                "height": 310,
                "carouselInterval": 800,
                "residenceTime": 1500
            },
            {
                "itemCode": 2002,
                "itemType": 1,
                "width": 236,
                "height": 630,
                "carouselInterval": 800,
                "residenceTime": 1500
            },
            {
                "itemCode": 2003,
                "itemType": 1,
                "width": 482,
                "height": 310,
                "carouselInterval": 800,
                "residenceTime": 1500
            },
            {
                "itemCode": 2004,
                "itemType": 1,
                "width": 482,
                "height": 630,
                "carouselInterval": 800,
                "residenceTime": 1500
            }
        ],
        data: {
            "carouselInterval": 800,
            "residenceTime": 1500,
            "productId": 200021,
            "productName": "新名片",
            "itemImgs": "http://cloud.ininin.com/image1/2015-07-17-18-25-26-328.jpg",
            //"itemImgs": "http://cloud.ininin.com/add-img.png",
            "hiperlink": "http://alpha.ininin.com/",
            "priceDesc": "低至5.8元/盒",
            "contentDesc": "【特种纸】——彰显身份的质感名片"
        }
    };
    FloorConfig.floorList = [];
    FloorConfig.tempComb = {};
    FloorConfig.temp = {};
    FloorConfig.item = {};
    T.Each(FloorConfig.itemList, function(i, item){
        FloorConfig.item[item.itemCode] = $.extend(true, {}, item, {
            data: [FloorConfig.data]
        });
    });
    T.Each(FloorConfig.tempList, function(i, temp){
        var itemList = [];
        T.Each(temp.itemList, function(k, itemCode){
            itemList.push($.extend(true, {}, FloorConfig.item[itemCode], {
                sort: k
            }));
        });
        FloorConfig.temp[temp.tempId] = $.extend(true, {}, temp, {
            sort: i,
            pageName: "页签名称",
            itemList: itemList
        });
    });
    T.Each(FloorConfig.tempCombList, function(i, tempComb){
        var pageList = [];
        T.Each(tempComb.tempList, function(k, tempId){
            pageList.push($.extend(true, {}, FloorConfig.temp[tempId], {
                sort: k
            }));
        });
        FloorConfig.tempComb[tempComb.tempCombId] = $.extend(true, {}, tempComb, {
            floorName: "楼层名称",
            pageList: pageList
        });
        FloorConfig.floorList.push(FloorConfig.tempComb[tempComb.tempCombId]);
    });
    return FloorConfig;
});
