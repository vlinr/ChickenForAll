export default class FormatNumber{
    private str:number=0;
    constructor(num:any){
        this.str=num;
    }
    public formatPoint(){
        let len:number=this.str.toString().length;
        if(len<=3){return this.str;}
        let l:number=len%3;
        return l>0?this.str.toString().slice(0,l)+","+this.str.toString().slice(l,len).match(/\d{3}/g).join(","):this.str.toString().slice(l,len).match(/\d{3}/g).join(",");
    }
    public formatPointNumber(){
        if (this.str > 99999 && this.str <= 99999999) {
            this.str = Math.floor(this.str / 1000);
            let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
              return ((index % 3) ? next : (next + ',')) + prev
            })
            return `${strOver}K`;
          } else if (this.str > 99999999 && this.str <= 99999999999) {
            this.str = Math.floor(this.str / 1000000);
            let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
              return ((index % 3) ? next : (next + ',')) + prev
            })
            return `${strOver}M`
          } else if (this.str > 99999999999 && this.str <= 99999999999999) {
            this.str = Math.floor(this.str / 1000000000);
            let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
              return ((index % 3) ? next : (next + ',')) + prev
            })
            return `${strOver}B`
          } else if (this.str > 99999999999999) {
            this.str = Math.floor(this.str / 1000000000000);
            let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
              return ((index % 3) ? next : (next + ',')) + prev
            })
            return `${strOver}T`
          }
          return this.str.toString().split("").reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
          });
    }
    public formatThreeNumber(){
      if (this.str > 999 && this.str <= 999999) {
          this.str = Math.floor(this.str / 1000);
          let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
          })
          return `${strOver}K`;
        } else if (this.str > 999999 && this.str <= 999999999) {
          this.str = Math.floor(this.str / 1000000);
          let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
          })
          return `${strOver}M`
        } else if (this.str > 999999999 && this.str <= 999999999999) {
          this.str = Math.floor(this.str / 1000000000);
          let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
          })
          return `${strOver}B`
        } else if (this.str > 999999999999) {
          this.str = Math.floor(this.str / 1000000000000);
          let strOver = this.str.toString().split("").reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + ',')) + prev
          })
          return `${strOver}T`
        }
        return this.str.toString().split("").reverse().reduce((prev, next, index) => {
          return ((index % 3) ? next : (next + ',')) + prev
        });
  }
}