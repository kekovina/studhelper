const axios = require("axios");
const parser = require("xml-js");

function getProgress(alaffair){
    return axios
    .get(
      `https://lk.tsu.tula.ru:3443/lk/android/AndroidProgress.php?alaffair=${alaffair}`
    )
    .then((res) => {
      if (res.status == 200) {
        return parser.xml2js(res.data, {
          compact: true,
          textFn: (value, parent) => {
            return value.replace(/^\!\[CDATA\[/, "").replace(/]]/, "");
          },
        }).Progress.ProgressItem;
      }
    })
    .then((data) =>
      data.map((item) => {
        item.name = item.DISCIPL._text;
        item.term = item.TERM._text;
        item.rate = item.RATING._text;
        item.km = item.KM._text;
        delete item.DISCIPL;
        delete item.TERM;
        delete item.KM;
        delete item.RATING;
        delete item.CODE_MARK;
        return item;
      })
    )
    .then((data) => {
      const result = [];
      for (let i = 1; i < 13; i++) {
        let filter = data.filter((item) => item.term == i);
        if (!filter.length) break;
        let subjects = Array.from(new Set(filter.map((z) => z.name)));
        let res = subjects.map((item) => {
          return { name: item };
        });
        filter.map((subj) => {
          let index = res.findIndex((c) => c.name == subj.name);
          if (subj.km == "атт1") {
            res[index] = { ...res[index], att1: subj.rate, total: subj.rate, km: 0};
          } else {
            let id_km = ['','ЗЧ', 'ДЗ', 'КР', 'Э']
            res[index] = { ...res[index], total: subj.rate, km: id_km.indexOf(subj.km.toUpperCase()) };
          }
        });
        res.sort((a,b) => b.km-a.km)
        result[i - 1] = res;
      }
      return result;
    })
  
}

export { getProgress }