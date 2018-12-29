//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    arrayLenUnit: ['bp', 'kb'],
    arrayMassUnit: ['mg', 'ug', 'ng', 'pg', 'fg'],
    arrayMoleUnit: ['umol', 'nmol', 'pmol', 'fmol'],
    lenIdx: 0,
    massIdx: 2,
    moleIdx: 2,
    lenInput: [],
    massInput: [],
    moleInput: [],
    ssDNA: false,
    pSize: 0
  },


  updateDNA: function (changeType) {
    // Fuction to calculate results and updates corresponding box
    // Everything is firstly converted to bp, ng and nmol firstly
    let dLen = Number(this.data.lenInput) * (1000 ** this.data.lenIdx);
    let dMass = Number(this.data.massInput) * (1000 ** (2 - this.data.massIdx));
    let dMole = Number(this.data.moleInput) * (1000 ** (1 - this.data.moleIdx));
    let strFactor = this.data.ssDNA + 1;
    // Decide which box to update
    switch (changeType) {
      case 0:
      case 1:
      case 3:
        this.setData({ moleInput: 0 });
        if (dLen != NaN && dLen != 0 && dMass != NaN && dMass != 0){
          let outMole = dMass / (dLen * 617.9 + 36.04) / strFactor;
          let outputM = findGoodUnitMo(outMole);
          this.setData({ moleInput: outputM[0].toFixed(3) });
          this.setData({ moleIdx: outputM[1] });
        }
        break;
      case 2:
        this.setData({ massInput: 0 });
        if (dLen != NaN && dLen != 0 && dMole != NaN && dMole != 0) {
          let outMass = dMole * (dLen * 617.9 + 36.04) * strFactor  ;
          let outputM = findGoodUnitMa(outMass);
          this.setData({ massInput: outputM[0].toFixed(3) });
          this.setData({ massIdx: outputM[1] });
        }
        break;
    }
  },

  updateProtein: function (changeType) {
    this.setData({
      pSize: (Number(this.data.lenInput) * 110 / 3).toFixed(2)
    });
  },

  //事件处理函数
  lenUnitChange: function(e) {
    this.setData({
      lenIdx: e.detail.value
    })
    this.updateDNA(0);
    this.updateProtein(0);
  },

  massUnitChange: function (e) {
    this.setData({
      massIdx: e.detail.value
    })
    this.updateDNA(1);
  },

  moleUnitChange: function (e) {
    this.setData({
      moleIdx: e.detail.value
    })
    this.updateDNA(2)
  },

  lenInputChange: function (e) {
    this.setData({
      lenInput: e.detail.value
    })
    this.updateDNA(0);
    this.updateProtein(0);
  },

  massInputChange: function (e) {
    this.setData({
      massInput: e.detail.value
    })
    this.updateDNA(1);
  },

  moleInputChange: function (e) {
    this.setData({
      moleInput: e.detail.value
    })
    this.updateDNA(2);
  },

  strandChange: function (e) {
    this.setData({
      ssDNA: e.detail.value
    })
    this.updateDNA(3);
  },

  onLoad: function () {
  }
})


function findGoodUnitMo(nmole){
  // Assuming all input in nmole
  let logM = Math.log10(nmole);
  if (logM >=2){
    return [nmole / 1000, 0];
  } else if (logM >= -1){
    return [nmole, 1];
  } else if (logM >= -4){
    return [nmole * 1000, 2];
  } else{
    return [nmole * 1000000, 3];
  }
}

function findGoodUnitMa(ng) {
  // Assuming all input in ng
  let logM = Math.log10(ng);
  if (logM >= 5) {
    return [ng / 1000000, 0];
  } else if (logM >= 2) {
    return [ng / 1000, 1];
  } else if (logM >= -1) {
    return [ng, 2];
  } else if (logM >= -4) {
    return [ng * 1000, 3];
  } else {
    return [ng * 1000000, 4];
  }
}