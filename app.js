(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const panels=[$("question-panel"),$("spread-panel"),$("draw-panel"),$("result-panel")];
  const state={question:"",category:"general",recommended:"three",spread:"three",positions:[],reversals:true,candidates:[],drawn:[]};
  const kindLabels={relationship:"关系",work:"工作",choice:"选择",wellbeing:"身心状态",growth:"自我成长",general:"眼前的事"};
  const closing={
    relationship:"把你能表达的需求说清楚，也给对方真实回应的空间。牌面无法替任何人说明内心，但可以帮助你辨认自己的界限。",
    work:"把最可控的一步写下来：需要谁的协作、何时尝试、怎样知道它有了进展。行动会让模糊的方向变得具体。",
    choice:"不必把牌当作替你决定的裁判。比较每条路的代价、资源与自己真正重视的东西，答案会更贴近现实。",
    wellbeing:"给自己留出休息与支持的空间。如果困扰持续或影响生活，向可信赖的人或专业人士求助也是积极的行动。",
    growth:"你已经在认真面对这个问题。接下来，选择一个足够小、可以持续的改变，让新的理解落在生活里。",
    general:"先从你能够影响的一件小事开始。牌面提供的是观察角度，真正的方向仍在你手里。"
  };
  const lead={
    relationship:"关于这段关系，牌更像一面镜子：它照见你的感受、互动中的张力，以及你可以采取的下一步。",
    work:"关于工作与方向，牌面提醒你同时看见眼前条件、阻碍所在和可以落实的行动。",
    choice:"当你面临选择，牌面邀请你把注意力从「哪条路一定正确」移向每条路真正要求你付出的东西。",
    wellbeing:"关于身心状态，这组牌邀请你放慢一点，辨认当下需要被照顾的部分。",
    growth:"关于自己的成长，牌面呈现的不只是结果，还有你正在学习如何与变化相处。",
    general:"围绕你的问题，这组牌先把眼前的线索摆在桌面上，再邀请你决定如何回应。"
  };
  function randomInt(max){
    if(!Number.isInteger(max)||max<1)throw new RangeError("Invalid range");
    const limit=Math.floor(0x100000000/max)*max;
    const values=new Uint32Array(1);
    let value;
    do{crypto.getRandomValues(values);value=values[0]}while(value>=limit);
    return value%max;
  }
  function shuffle(items){
    const out=[...items];
    for(let i=out.length-1;i>0;i--){const j=randomInt(i+1);[out[i],out[j]]=[out[j],out[i]]}
    return out;
  }
  function show(panel){
    for(const item of panels)item.classList.toggle("hidden",item!==panel);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function categorize(question){
    if(/恋|爱|感情|关系|伴侣|复合|分手|暧昧|朋友|婚|对方|他|她/.test(question))return "relationship";
    if(/工作|职场|事业|求职|面试|职业|老板|同事|创业|项目|升职|跳槽|学习|考试/.test(question))return "work";
    if(/选择|决定|要不要|该不该|是否|还是|哪个|哪条|犹豫/.test(question))return "choice";
    if(/健康|疲惫|焦虑|压力|睡眠|情绪|难过|抑郁|身心/.test(question))return "wellbeing";
    if(/成长|自己|方向|改变|迷茫|内心|未来/.test(question))return "growth";
    return "general";
  }
  function positionsFor(question,category,spread){
    if(spread==="one")return ["当下指引"];
    if(/过去|现在|未来|之后|接下来|发展|走向/.test(question))return ["过去的影响","当下的力量","可能的走向"];
    if(category==="relationship")return ["你的感受","关系的张力","可做的下一步"];
    if(category==="work")return ["目前的处境","需要面对的","可执行的行动"];
    if(category==="choice")return ["当前选择","关键考量","可行的下一步"];
    if(category==="wellbeing")return ["当下状态","需要照顾的","温柔的行动"];
    return ["现状","阻力","建议"];
  }
  function chooseRecommendation(question){
    return /^(今天|今日|这一天|每日|此刻|现在).*(提醒|留意|指引|提示|注意)|每日一牌|今日运势/.test(question)?"one":"three";
  }
  function updateSpreadUI(){
    const options=document.querySelectorAll(".spread-option");
    options.forEach(button=>{
      const selected=button.dataset.spread===state.spread;
      button.classList.toggle("selected",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    state.positions=positionsFor(state.question,state.category,state.spread);
    $("three-description").textContent=positionsFor(state.question,state.category,"three").join(" · ");
  }
  function enterSpread(){
    state.question=$("question").value.trim().replace(/\s+/g," ");
    if(!state.question){$("question").focus();return}
    state.category=categorize(state.question);
    state.recommended=chooseRecommendation(state.question);
    state.spread=state.recommended;
    $("question-echo").textContent="“"+state.question+"”";
    const type=kindLabels[state.category];
    $("spread-reason").textContent=state.recommended==="one"
      ? "你问的是当下的提示。一张牌足以聚焦眼前最值得留意的线索；想看更多层次，也可以选三张牌。"
      : "关于"+type+"，我建议抽三张牌，依次看见不同层次；如果只想获得一句简短提示，也可以选一张。";
    updateSpreadUI();
    show($("spread-panel"));
  }
  function makeElement(tag,className,textValue){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(textValue!==undefined)el.textContent=textValue;
    return el;
  }
  function renderSlots(){
    const root=$("chosen-slots");
    root.replaceChildren();
    state.positions.forEach((position,index)=>{
      const slot=makeElement("div","chosen-slot");
      const picked=state.drawn[index];
      const face=makeElement("div",picked?"chosen-card":"chosen-placeholder");
      if(picked){const img=document.createElement("img");img.src="./assets/cards/back.svg";img.alt="牌背";face.append(img)}
      else face.textContent=String(index+1).padStart(2,"0");
      slot.append(face,makeElement("span","",position));
      root.append(slot);
    });
    const complete=state.drawn.length===state.positions.length;
    $("draw-progress").textContent="已抽 "+state.drawn.length+" / "+state.positions.length+" 张";
    $("draw-instruction").textContent=complete?"牌已齐，准备好了就揭开牌面。":"请凭直觉点击牌背，抽取第 "+(state.drawn.length+1)+" 张： "+state.positions[state.drawn.length];
    $("reveal").classList.toggle("hidden",!complete);
  }
  function renderDeck(){
    const root=$("deck");
    root.replaceChildren();
    const count=state.candidates.length;
    state.candidates.forEach((card,index)=>{
      const button=makeElement("button","deck-card");
      button.type="button";
      button.setAttribute("aria-label","抽取第 "+(index+1)+" 张可选牌");
      button.dataset.index=String(index);
      const center=(count-1)/2;
      const offset=index-center;
      button.style.setProperty("--x",(offset*54)+"px");
      button.style.setProperty("--y",(Math.abs(offset)*5)+"px");
      button.style.setProperty("--r",(offset*5.5)+"deg");
      button.style.setProperty("--delay",(index*35)+"ms");
      button.style.zIndex=String(index<=center?index+1:count-index);
      const img=document.createElement("img");
      img.src="./assets/cards/back.svg";
      img.alt="";
      button.append(img);
      button.addEventListener("click",()=>pickCard(index));
      root.append(button);
    });
  }
  function resetDraw(){
    state.drawn=[];
    state.candidates=shuffle(window.TAROT_DATA).slice(0,9);
    renderSlots();
    renderDeck();
  }
  function enterDraw(){
    state.reversals=$("reversals").checked;
    state.positions=positionsFor(state.question,state.category,state.spread);
    $("draw-question").textContent="“"+state.question+"”";
    resetDraw();
    show($("draw-panel"));
  }
  function pickCard(index){
    if(state.drawn.length>=state.positions.length)return;
    const card=state.candidates[index];
    if(!card)return;
    state.drawn.push({card,reversed:state.reversals&&randomInt(2)===1});
    state.candidates[index]=null;
    const button=$("deck").querySelector('[data-index="'+index+'"]');
    button.disabled=true;
    button.classList.add("picked");
    renderSlots();
    const next=$("deck").querySelector(".deck-card:not(:disabled)");
    if(next)next.focus({preventScroll:true});
    if(state.drawn.length===state.positions.length)$("reveal").focus({preventScroll:true});
  }
  function renderResultCards(){
    const root=$("result-cards");
    root.replaceChildren();
    state.drawn.forEach(({card,reversed},index)=>{
      const article=makeElement("article","result-card");
      const image=makeElement("div","result-image"+(reversed?" reversed":""));
      const img=document.createElement("img");
      img.src="./assets/cards/"+card.file;
      img.alt=card.name+"牌面";
      img.loading="lazy";
      image.append(img);
      article.append(image,makeElement("span","result-position",state.positions[index]),makeElement("strong","",card.name),makeElement("span","orientation",reversed?"逆位 · 重新审视":"正位 · 自然流动"));
      root.append(article);
    });
  }
  function renderReading(){
    const root=$("reading-content");
    root.replaceChildren();
    const add=(text,klass)=>root.append(makeElement("p",klass||"",text));
    add(state.drawn.length===1
      ? "我把这张牌读作你此刻的一盏小灯。关于"+kindLabels[state.category]+"，它把注意力带向"+state.drawn[0].card.theme+"。"
      : lead[state.category],"reading-lead");
    state.drawn.forEach(({card,reversed},index)=>{
      const meaning=reversed?card.rev:card.up;
      let text="在「"+state.positions[index]+"」的位置，"+card.name+"以"+(reversed?"逆位":"正位")+"出现。"+meaning;
      text+=" "+card.act;
      add(text);
    });
    if(state.drawn.length===3){
      const majorCount=state.drawn.filter(item=>item.card.arcana==="大阿尔卡那").length;
      const reverseCount=state.drawn.filter(item=>item.reversed).length;
      const [first,middle,last]=state.drawn;
      let bridge="把三张牌连起来看："+first.card.name+"将焦点放在"+first.card.theme+"，"+middle.card.name+"提醒你留意"+middle.card.theme+"，而"+last.card.name+"把下一步带向"+last.card.theme+"。";
      if(majorCount>=2)bridge+="这不只是眼前的小插曲，也触及你正在经历的较大转变。";
      else bridge+="线索更多落在日常选择与具体互动中。";
      if(reverseCount>=2)bridge+=" 多张逆位提醒你先辨认卡住的环节，不必急于推动结果。";
      else if(last.reversed)bridge+=" 最后一张牌处于逆位，下一步适合先调整内在阻力，再向外推进。";
      else bridge+=" 顺着最后一张牌的提示，先让下一步清楚起来。";
      add(bridge);
    }
    add(closing[state.category]);
    add("这份解读只是一种象征性的视角。保留与你的处境相符的部分，放下不适合的部分。","reading-note");
  }
  function reveal(){
    if(state.drawn.length!==state.positions.length)return;
    $("result-question").textContent="“"+state.question+"”";
    renderResultCards();
    renderReading();
    show($("result-panel"));
  }
  $("question-form").addEventListener("submit",event=>{event.preventDefault();enterSpread()});
  $("question").addEventListener("input",()=>{$("char-count").textContent=$("question").value.length+" / 180"});
  document.querySelectorAll("[data-question]").forEach(button=>button.addEventListener("click",()=>{
    $("question").value=button.dataset.question;
    $("char-count").textContent=$("question").value.length+" / 180";
    $("question").focus();
  }));
  document.querySelectorAll(".spread-option").forEach(button=>button.addEventListener("click",()=>{
    state.spread=button.dataset.spread;updateSpreadUI();
  }));
  $("begin-draw").addEventListener("click",enterDraw);
  $("reshuffle").addEventListener("click",resetDraw);
  $("reveal").addEventListener("click",reveal);
  $("new-reading").addEventListener("click",()=>{
    $("question").value="";
    $("char-count").textContent="0 / 180";
    show($("question-panel"));
    $("question").focus({preventScroll:true});
  });
  $("about-button").addEventListener("click",()=>$("about-dialog").showModal());
  if(!window.TAROT_DATA||window.TAROT_DATA.length!==78)throw new Error("The tarot deck is incomplete.");
})();

