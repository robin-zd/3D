const filterButtons = document.querySelectorAll(".filter-button");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    workCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const fields = {
  purpose: document.querySelector("#purpose"),
  height: document.querySelector("#height"),
  heightValue: document.querySelector("#heightValue"),
  complexity: document.querySelector("#complexity"),
  colors: document.querySelector("#colors"),
  displayBox: document.querySelector("#displayBox"),
  rush: document.querySelector("#rush"),
};

const priceNodes = {
  a: document.querySelector("#priceA"),
  b: document.querySelector("#priceB"),
  c: document.querySelector("#priceC"),
  timeA: document.querySelector("#timeA"),
  timeB: document.querySelector("#timeB"),
  timeC: document.querySelector("#timeC"),
  summary: document.querySelector("#quoteSummary"),
};

const complexityMap = {
  simple: {
    label: "简单整体结构",
    factor: 0.82,
    modeling: 90,
    split: 30,
    polish: 35,
    days: 0,
  },
  standard: {
    label: "标准细节",
    factor: 1,
    modeling: 150,
    split: 90,
    polish: 55,
    days: 2,
  },
  complex: {
    label: "复杂多部件",
    factor: 1.38,
    modeling: 280,
    split: 190,
    polish: 95,
    days: 5,
  },
};

const purposeMultiplier = {
  pet: 1,
  gift: 1.08,
  ip: 1.12,
  desk: 0.92,
  mecha: 1.24,
};

const purposeLabel = {
  pet: "宠物纪念",
  gift: "生日/情侣礼物",
  ip: "原创IP/潮玩",
  desk: "桌面摆件",
  mecha: "机甲/复杂模型",
};

function yuan(value) {
  const rounded = Math.round(value / 10) * 10;
  const low = Math.max(80, Math.round((rounded * 0.88) / 10) * 10);
  const high = Math.round((rounded * 1.14) / 10) * 10;
  return `¥${low}-${high}`;
}

function updateQuote() {
  const height = Number(fields.height.value);
  const colors = Math.max(1, Number(fields.colors.value || 1));
  const complexity = complexityMap[fields.complexity.value];
  const purposeFactor = purposeMultiplier[fields.purpose.value];
  const boxFee = fields.displayBox.checked ? 60 : 0;
  const rushFee = fields.rush.checked ? 120 : 0;
  const sizeFactor = Math.pow(height / 10, 1.35);

  fields.heightValue.textContent = height;

  const material = 42 * sizeFactor * complexity.factor;
  const machineTime = 68 * sizeFactor * complexity.factor;
  const design = 50;
  const concept = 50;
  const fourView = 80;
  const risk = 45 * complexity.factor;
  const paintPack = 28 + colors * 8;
  const colorWork = 110 + colors * 24 + height * 8;

  const planA = (design + concept + complexity.modeling * 0.72 + material + machineTime + complexity.polish + paintPack + risk + rushFee) * purposeFactor;
  const planB = (design + concept + fourView + complexity.modeling + material * 1.08 + machineTime * 1.08 + complexity.split + complexity.polish + paintPack + risk + rushFee) * purposeFactor;
  const planC = (design + concept + fourView + complexity.modeling + material * 1.12 + machineTime * 1.12 + complexity.split + complexity.polish * 1.4 + colorWork + boxFee + 25 + risk + rushFee) * purposeFactor;

  const dayRushOffset = fields.rush.checked ? -2 : 0;
  const daysA = Math.max(5, 7 + complexity.days + Math.round(height / 8) + dayRushOffset);
  const daysB = Math.max(7, 10 + complexity.days + Math.round(height / 7) + dayRushOffset);
  const daysC = Math.max(9, 13 + complexity.days + Math.round(height / 6) + Math.ceil(colors / 4) + dayRushOffset);

  priceNodes.a.textContent = yuan(planA);
  priceNodes.b.textContent = yuan(planB);
  priceNodes.c.textContent = yuan(planC);
  priceNodes.timeA.textContent = `预计 ${daysA}-${daysA + 3} 天`;
  priceNodes.timeB.textContent = `预计 ${daysB}-${daysB + 4} 天`;
  priceNodes.timeC.textContent = `预计 ${daysC}-${daysC + 5} 天`;

  const recommended = fields.complexity.value === "simple" && height <= 8 ? "方案 A" : fields.colors.value > 6 || fields.displayBox.checked ? "方案 C" : "方案 B";
  const deposit = Math.round((planB * 0.4) / 10) * 10;

  priceNodes.summary.innerHTML = `
    <strong>客户版报价摘要</strong>
    ${purposeLabel[fields.purpose.value]}，${height}cm，${complexity.label}，约 ${colors} 个颜色。
    建议先给客户展示 ${recommended}，定金可按拆件白膜方案约 40% 收取，约 ¥${deposit}。
    若参考图细节很多、需要磁吸或插销结构，最终价格需要在模型检查后再次确认。
  `;
}

["input", "change"].forEach((eventName) => {
  Object.values(fields).forEach((field) => {
    if (field instanceof HTMLElement) {
      field.addEventListener(eventName, updateQuote);
    }
  });
});

updateQuote();
