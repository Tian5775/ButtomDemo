Vue.component("newButton",{
    'props': ['buttonData','level'],
    'template': '<button v-on:click="clickFunc" v-bind:value="buttonData.value"  v-bind:class="{\'button-checked\': buttonData.isChecked, \'button-checkChild\': buttonData.isChildren , \'button-open\': buttonData.isOpen}">{{buttonData.text}}</button>',
    'methods': {
        clickFunc: function () {
            if (this.level == 1){
                app.secondButtonData = this.buttonData.children;
                var thisValueAry = this.parentAndThisValue(this.buttonData.value);
                this.changeClass(thisValueAry);
            }
            else if (this.level == 2){
                /*if(this.buttonData.isOpen){
                    app.thirdButtonData = this.buttonData.children;
                } else {
                    app.thirdButtonData = [];
                }*/
                app.thirdButtonData = this.buttonData.children;

                var thisValueAry = this.parentAndThisValue(this.buttonData.value);
                this.changeClass(thisValueAry);
            }
            else if (this.level == 3){
                var thisValueAry = this.parentAndThisValue(this.buttonData.value);
                this.changeClass(thisValueAry);
            }
        },
        parentAndThisValue: function (data) {
            if (data){
                if (typeof(data) == "number"){
                    data = data.toString();
                }
                var dataAry = data.split("-");
                var dataValue = [];
                for (var i = 0; i < dataAry.length; i++ ){
                    if (dataValue[i - 1]) {
                        dataValue[i] = dataValue[i - 1] + "-" + dataAry[i];
                    } else {
                        dataValue[i] = dataAry[i];
                    }
                }
                return dataValue;
            }
        },
        changeClass: function(ary){
            if (ary && ary.length > 0){
                //app.defaultData = this.checkValue(app.defaultData,ary);
                app.firstButtonData = this.checkValue(app.firstButtonData,ary);
            }
        },
        checkValue: function (data, ary) {
            if (data && data.length > 0 && ary && ary.length > 0){
                for (var i = 0; i < data.length; i++ ){
                    if (data[i].value == ary[0]){
                        if (ary[1]){
                            if (data[i].children){
                                ary.shift();
                                data[i].children = this.checkValue(data[i].children,ary);
                            }
                            var isChildren = false;
                            for (var j = 0; j < data[i].children.length; j++){
                                if (data[i].children[j].isChildren || data[i].children[j].isChecked){
                                    isChildren = true;
                                }
                            }
                            data[i].isChildren = isChildren;
                        } else {
                            data[i].isChecked = !data[i].isChecked;
                        }
                    }
                }
                return data;
            }
        }

    }
});

Vue.component("spanButton",{
    'props': ['isClose'],
    'template': '<span class="open" v-bind:class="{close: isClose.value}" v-on:click="spanClick"></span>',
    'methods': {
        spanClick: function () {
            this.isClose.value = !this.isClose.value;
            app[this.isClose.name] = this.isClose.value;
        }
    }
});

var app = new Vue({
    el: '#app',
    data: data,
    methods:{
        defaultValue: function(data){
            var data = JSON.parse(JSON.stringify(data));
            var newData = [];
            for(var i = 0; i < data.length ; i ++){
                data[i].value = i;
                data[i] = this.defalutValue2(data[i]);
            }
            return data;
        },
        defalutValue2: function(data){
            var thisData = JSON.parse(JSON.stringify(data));
            if(thisData.children && thisData.children.length > 0){
                for(var i = 0; i < thisData.children.length; i++){
                    thisData.children[i].value = thisData.value + "-" + i;
                    if(thisData.children[i].children){
                        thisData.children[i] = this.defalutValue2(thisData.children[i]);
                    }
                }
            }
            return thisData;
        },
        test:function () {
            this.defaultData[1].isChecked = !this.defaultData[1].isChecked;
            console.log(this.defaultData[1].text + ":" + this.defaultData[1].isChecked);
        }
    },
    created: function(){
        this.firstButtonData = this.defaultValue(this.firstButtonData);
    }
});