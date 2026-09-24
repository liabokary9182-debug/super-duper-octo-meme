(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const panels=[$("question-panel"),$("spread-panel"),$("draw-panel"),$("result-panel")];
  const state={question:"",category:"general",focus:null,concern:null,recommended:"three",spread:"three",positions:[],reversals:true,candidates:[],drawn:[]};
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
  const focusRules=[
    {pattern:/复合|前任|重新在一起/,label:"重新靠近一段旧关系",framing:"你想知道旧关系还有没有重新靠近的可能。我会特别看旧模式是否改变，以及双方能否用新的方式沟通。",question:"过去让你们疏远的问题，今天有了不同的处理方式吗？",action:"先辨认自己想念的是这个人，还是曾经的熟悉感；若要联系，用清楚而不过度施压的话开场。"},
    {pattern:/分手|离开.*关系|结束.*感情/,label:"一段关系的去留",framing:"你正在衡量一段关系是否还适合继续。牌面不能替你决定留下或离开，却能帮你看见耗损与仍可修复之处。",question:"你反复退让的部分，是暂时的摩擦，还是已经触及自己的底线？",action:"先写下不可妥协的需要，再决定要谈一次、暂时拉开距离，还是结束关系。"},
    {pattern:/暧昧|喜欢我|对方.*(心意|想法|态度)|[他她].*(喜欢|在乎)我/,label:"尚未明朗的心意",framing:"你在意的是这份关系究竟走到哪里。我会把牌读作互动的线索，不替对方宣称没有说出口的心意。",question:"对方实际做了什么，与你希望他或她做的有什么不同？",action:"用一次具体、坦诚的交流确认彼此期待，不让猜测独自承担全部答案。"},
    {pattern:/冷战|争吵|吵架|沟通|误会/,label:"沟通中的距离",framing:"你想让沟通重新流动。这里最值得看的是各自想被理解的部分，以及谈话为什么会卡住。",question:"你更需要对方理解你的感受，还是一起解决一个具体问题？",action:"选一个安静的时刻，说出一件事实、一种感受和一个可回应的请求。"},
    {pattern:/跳槽|离职|换工作|转行|工作变化|职业变化/,label:"职业转向",framing:"你正在面对工作方向的变化。我会看当前岗位还能提供什么、哪些阻力是真实的，以及下一步需要怎样试探。",question:"让你想改变的，是环境、工作内容，还是成长空间？",action:"先列出新方向的必要条件，再做一项低风险验证，例如了解岗位、更新作品或与业内人士交谈。"},
    {pattern:/求职|找工作|面试|录用|offer/i,label:"求职与机会",framing:"你在等待一扇职业上的门打开。牌面更适合帮助你检查准备、表达与选择，而不是保证某一次结果。",question:"你的经验中，哪一项最能回应目标岗位真正需要的能力？",action:"把经历整理成具体事例，同时保留不止一个可行机会。"},
    {pattern:/升职|晋升|加薪/,label:"争取认可",framing:"你希望努力被看见。我会关注成果是否足够清晰、期待是否已被沟通，以及你能主动争取的空间。",question:"你的贡献是否已经用对方能理解的方式呈现？",action:"整理可量化成果，并准备一次具体谈话，确认标准和时间表。"},
    {pattern:/创业|项目|合作|合伙/,label:"项目与合作",framing:"你关心的是事情能否真正推进。牌面会帮助区分灵感、资源和合作中的责任。",question:"目前最薄弱的一环，是资源、分工，还是对目标的共识？",action:"先把下一阶段的目标、负责人和检验方式写清楚。"},
    {pattern:/考试|学习|备考|学校/,label:"学习与准备",framing:"你正在为一个需要积累的目标努力。我会把牌读成学习节奏、压力与方法的提醒。",question:"眼下最影响表现的，是知识缺口，还是疲惫与分心？",action:"把目标拆成短周期练习，并安排足够的休息和复盘。"},
    {pattern:/焦虑|压力|失眠|睡眠|疲惫|情绪/,label:"身心的负担",framing:"你希望知道如何照顾现在的自己。这组牌只提供自我观察的线索，不替代专业帮助。",question:"什么事情正在反复消耗你，而你一直没有给它命名？",action:"先减少一项不必要的负担；若困扰持续或影响日常生活，联系可信赖的人或专业人士。"},
    {pattern:/搬家|迁居|城市|异地/,label:"生活地点的变化",framing:"你正考虑换一个生活位置。我会同时看离开的理由、现实条件和你想带去的新生活。",question:"新地方最吸引你的是什么，最需要提前解决的现实问题又是什么？",action:"列出成本、支持网络和试住或短期考察的可能，再作决定。"},
    {pattern:/投资|理财|收入|财务|工资|钱/,label:"资源与金钱",framing:"你在衡量现实资源。我会把牌读作风险意识与选择顺序的提醒，而不是收益预测。",question:"最需要先确认的，是承受风险的能力，还是这笔投入的必要性？",action:"用实际数字核对预算与风险，重大财务决定再向合格专业人士咨询。"},
    {pattern:/选择|决定|要不要|该不该|是否|还是|哪个|哪条/,label:"一个尚未落定的选择",framing:"你希望在几条路之间看得更清楚。我会把牌当作比较条件的镜子，不把它读成替你做决定的命令。",question:"每个选项要你付出的代价，与你最重视的价值是否相称？",action:"给每个选项写下收益、代价与可逆性，再选择一个可验证的小步骤。"},
    {pattern:/今天|今日|每日|此刻/,label:"当下的提醒",framing:"你想知道今天最值得留意什么。先不用寻找宏大的预言，这张牌更像一枚照亮眼前的小灯。",question:"今天哪件小事最值得你认真回应？",action:"选一个可以在今天完成的小行动，让牌面的提醒落到现实里。"},
    {pattern:/迷茫|方向|未来|成长|改变/,label:"下一段方向",framing:"你正在为未来寻找方向。我会看见你已经拥有的力量、尚未清楚的阻力，以及可以尝试的第一步。",question:"你真正想改变的，是目标本身，还是抵达目标的方法？",action:"先设一个短期试验，不必在今天决定整条人生路线。"}
  ];
  const fallbackFocus={
    relationship:{label:"关系中的疑问",framing:lead.relationship,question:"这段关系里，你最需要被理解的是什么？",action:closing.relationship},
    work:{label:"工作中的方向",framing:lead.work,question:"现在最值得优先处理的现实问题是什么？",action:closing.work},
    choice:{label:"眼前的选择",framing:lead.choice,question:"哪种代价是你愿意承担的？",action:closing.choice},
    wellbeing:{label:"身心状态",framing:lead.wellbeing,question:"你目前最需要什么样的支持？",action:closing.wellbeing},
    growth:{label:"自己的成长",framing:lead.growth,question:"哪一步能让你真正开始改变？",action:closing.growth},
    general:{label:"眼前的疑问",framing:lead.general,question:"哪些是已知事实，哪些还只是猜测？",action:closing.general}
  };
  function findFocus(question,category){
    return focusRules.find(rule=>rule.pattern.test(question))||fallbackFocus[category];
  }
  const concernRules=[
    {pattern:/收入|工资|经济|预算|房贷|存款/,skip:"资源与金钱",text:"你也在意收入与安全感。阅读牌面时，值得同时衡量愿望和过渡期的现实保障。",step:"把必要开支、可用储备和新机会的收入范围放在一起核对。"},
    {pattern:/父母|家人|家庭|孩子/,skip:"",text:"家人的期待也是这道问题的一部分。先分清你愿意承担的责任，以及哪些选择仍该由你自己做。",step:"与家人谈清你能承担的部分，也说出需要自主决定的部分。"},
    {pattern:/信任|背叛|隐瞒|欺骗/,skip:"",text:"你提到了信任。比猜测动机更重要的，是看对方是否愿意以持续的行动修复它。",step:"请求一个可观察的改变，而不是只等待口头保证。"},
    {pattern:/异地|距离|两地|远距离/,skip:"生活地点的变化",text:"距离让这件事多了一层现实条件。除了感受，也要看双方能否约定可执行的见面与沟通方式。",step:"商定可执行的联系节奏，再看彼此能否持续做到。"},
    {pattern:/来不及|年龄|时间不够|太晚/,skip:"",text:"时间压力可能让你想尽快得到确定答案。先确认这个期限是真实限制，还是焦虑给出的倒计时。",step:"为决定设一个合理期限，不必被仓促感牵着走。"},
    {pattern:/不确定|不明确|模糊|看不清/,skip:"",text:"你正被不确定性牵动。牌面能提供观察角度，但清楚的事实仍要靠沟通与验证。",step:"列出最需要确认的三件事实，再选择合适的方式求证。"},
    {pattern:/疲惫|耗尽|太累|压力大/,skip:"身心的负担",text:"疲惫会改变你看待选择的方式。在作重要决定前，先给自己一点恢复的空间。",step:"留出一段固定的休息时间，再回头看这个决定。"}
  ];
  function findConcern(question,focus){
    return concernRules.find(rule=>rule.pattern.test(question)&&rule.skip!==focus.label)||null;
  }
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
  let soundEnabled=true;
  let audioContext=null;
  let transitionBusy=false;
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  function getAudio(){
    if(!soundEnabled)return null;
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return null;
    try{
      if(!audioContext)audioContext=new Context();
      if(audioContext.state==="suspended")audioContext.resume().catch(()=>{});
      return audioContext;
    }catch{return null}
  }
  function tone(ctx,frequency,delay,duration,volume,type="sine"){
    const start=ctx.currentTime+delay;
    const oscillator=ctx.createOscillator();
    const gain=ctx.createGain();
    oscillator.type=type;
    oscillator.frequency.setValueAtTime(frequency,start);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.exponentialRampToValueAtTime(volume,start+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start+duration+.02);
  }
  function paperSound(ctx,volume=.018){
    const length=Math.floor(ctx.sampleRate*.16);
    const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
    const source=ctx.createBufferSource();
    const filter=ctx.createBiquadFilter();
    const gain=ctx.createGain();
    source.buffer=buffer;
    filter.type="lowpass";
    filter.frequency.value=1350;
    gain.gain.value=volume;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start();
  }
  function playSound(kind){
    const ctx=getAudio();
    if(!ctx)return;
    if(kind==="page"){
      tone(ctx,392,0,.28,.021);
      tone(ctx,588,.11,.34,.016);
    }else if(kind==="draw"){
      paperSound(ctx,.025);
      tone(ctx,659,.06,.38,.026);
      tone(ctx,988,.13,.42,.013);
    }else if(kind==="reveal"){
      paperSound(ctx,.013);
      tone(ctx,392,0,.42,.025);
      tone(ctx,494,.13,.48,.024);
      tone(ctx,740,.27,.7,.022);
    }else if(kind==="shuffle"){
      paperSound(ctx,.032);
      tone(ctx,330,.03,.24,.014);
    }
  }
  function renderPanel(panel){
    for(const item of panels)item.classList.toggle("hidden",item!==panel);
    const frame=document.querySelector(".reading-frame");
    frame.dataset.stage=panel.id;
    const top=panel===$("question-panel")?0:frame.getBoundingClientRect().top+window.scrollY-8;
    window.scrollTo({top:Math.max(0,top),behavior:"auto"});
  }
  function focusPanel(panel){
    const heading=panel.querySelector("h2");
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true})}
  }
  function show(panel,label,soundKind="page"){
    if(transitionBusy)return Promise.resolve(false);
    if(reducedMotion.matches){
      renderPanel(panel);
      focusPanel(panel);
      playSound(soundKind);
      return Promise.resolve(true);
    }
    transitionBusy=true;
    const frame=document.querySelector(".reading-frame");
    const veil=$("transition-veil");
    $("transition-label").textContent=label;
    frame.classList.add("is-transitioning");
    frame.inert=true;
    frame.setAttribute("aria-busy","true");
    veil.classList.add("is-closing");
    playSound(soundKind);
    return new Promise(resolve=>{
      window.setTimeout(()=>{
        renderPanel(panel);
        veil.classList.remove("is-closing");
        veil.classList.add("is-opening");
        window.setTimeout(()=>{
          veil.classList.remove("is-opening");
          frame.classList.remove("is-transitioning");
          frame.inert=false;
          frame.removeAttribute("aria-busy");
          transitionBusy=false;
          focusPanel(panel);
          resolve(true);
        },440);
      },440);
    });
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
    if(transitionBusy)return;
    state.question=$("question").value.trim().replace(/\s+/g," ");
    if(!state.question){$("question").focus();return}
    state.category=categorize(state.question);
    state.focus=findFocus(state.question,state.category);
    state.concern=findConcern(state.question,state.focus);
    state.recommended=chooseRecommendation(state.question);
    state.spread=state.recommended;
    $("question-echo").textContent="“"+state.question+"”";
    $("spread-reason").textContent=state.recommended==="one"
      ? "你问的是"+state.focus.label+"。我建议用一张牌聚焦此刻；想看更多层次，也可以选三张。"
      : "你关心的是"+state.focus.label+"。我建议抽三张牌，让现状、张力和行动逐一展开；也可以改选一张。";
    updateSpreadUI();
    show($("spread-panel"),"II · THE SPREAD");
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
  function resetDraw(withSound=false){
    state.drawn=[];
    state.candidates=shuffle(window.TAROT_DATA).slice(0,9);
    renderSlots();
    renderDeck();
    if(withSound)playSound("shuffle");
  }
  function enterDraw(){
    if(transitionBusy)return;
    state.reversals=$("reversals").checked;
    state.positions=positionsFor(state.question,state.category,state.spread);
    $("draw-question").textContent="“"+state.question+"”";
    resetDraw();
    show($("draw-panel"),"III · THE DRAW");
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
    playSound("draw");
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
  function buildFinalAnswer(){
    const focus=state.focus||fallbackFocus[state.category];
    const last=state.drawn[state.drawn.length-1];
    const reverseCount=state.drawn.filter(item=>item.reversed).length;
    const cautious=last.reversed||reverseCount>=2;
    const cardHint=(last.reversed?last.card.rev:last.card.up).split(/[，；。]/)[0];
    let answer;
    switch(focus.label){
      case "重新靠近一段旧关系":
        answer=cautious?"现在先不要急着复合；先确认当初造成分开的事是否真的改变。":"可以试着重新联系，但是否复合要看双方能否坦诚处理过去的问题。";break;
      case "一段关系的去留":
        answer=cautious?"如果同样的问题一再伤害你，我倾向于先拉开距离，再决定是否结束关系。":"可以先给这段关系一次具体的沟通机会，再看双方是否愿意改变。";break;
      case "尚未明朗的心意":
        answer="牌不能替对方回答是否喜欢你；目前更可靠的答案来自对方持续的行动和一次坦诚的交流。";break;
      case "沟通中的距离":
        answer="这段沟通还有推进空间，但先谈一件具体的事，听清彼此真正的需要。";break;
      case "职业转向":
        answer=cautious?"现在不宜仓促离职；先验证新方向和过渡期的保障，再决定何时换工作。":"可以认真推进换工作的计划；先确认新机会、收入和过渡安排，再作最终决定。";break;
      case "求职与机会":
        answer=cautious?"这次机会还不能当作确定结果；继续准备面试，也保留其他选择。":"这份机会值得争取；用具体经历回应岗位要求，同时继续关注后续反馈。";break;
      case "争取认可":
        answer=cautious?"先不要只等待认可；把成果和晋升标准谈清楚，再判断下一步。":"可以主动争取晋升或加薪；带着具体成果提出请求并确认时间表。";break;
      case "项目与合作":
        answer=cautious?"这个项目先别急着扩大投入；把资源、分工和风险核实后再推进。":"可以推进这个项目；先把责任、资源和下一阶段目标约定清楚。";break;
      case "学习与准备":
        answer=cautious?"眼下先调整学习方法和休息节奏，比继续硬撑更有帮助。":"继续准备是可行的；把重点放在短周期练习和复盘上。";break;
      case "身心的负担":
        answer="先减轻一项正在消耗你的负担，并寻求可信赖的支持；如果困扰持续影响生活，请联系专业人士。";break;
      case "生活地点的变化":
        answer=cautious?"先不要急着搬；核对费用、生活支持和实际落脚条件后再决定。":"搬迁可以认真考虑；先确认成本、支持网络和适应新地方的安排。";break;
      case "资源与金钱":
        answer="先以实际数字核对预算和可承受的风险，再决定是否投入；牌面不能预测收益。";break;
      case "一个尚未落定的选择":
        answer=cautious?"我倾向于暂缓定案，先核实最关键的条件和代价。":"可以朝更符合你核心需要的选项迈出一步，但先用小规模尝试验证它。";break;
      case "当下的提醒":
        answer="今天最值得做的，是把注意力放在一件你能完成的小事上。";break;
      case "下一段方向":
        answer=cautious?"先不要逼自己马上确定长期方向；用一个短期尝试看清真正的阻力。":"可以开始探索你想要的方向；先迈出一小步，再根据实际反馈调整。";break;
      default:
        answer=/该不该|要不要|是否|能不能|可不可以|适不适合|值得吗/.test(state.question)?(cautious?"我倾向于先不要仓促推进；确认关键条件后再决定。":"可以先尝试，但请用现实反馈确认这条路是否适合你。"):("眼下先从一件可以核实或改变的事入手，再判断下一步。 "+focus.action);
    }
    if(state.concern&&/收入|工资|经济|预算|房贷|存款/.test(state.question))answer+=" 特别要先算清收入变化与必要开支。";
    return "给你的回答："+answer+" 这张牌的依据是"+last.card.name+"（"+(last.reversed?"逆位":"正位")+"）提示的「"+cardHint+"」。";
  }
  function renderReading(){
    const root=$("reading-content");
    root.replaceChildren();
    const add=(text,klass)=>root.append(makeElement("p",klass||"",text));
    const focus=state.focus||fallbackFocus[state.category];
    add(focus.framing,"reading-lead");
    if(state.concern)add(state.concern.text,"reading-context");
    state.drawn.forEach(({card,reversed},index)=>{
      const meaning=reversed?card.rev:card.up;
      const leadIn=state.drawn.length===1?"这张牌":("第"+["一","二","三"][index]+"张牌");
      let text=leadIn+"是「"+state.positions[index]+"」上的"+card.name+"（"+(reversed?"逆位":"正位")+"）。"+meaning+" "+card.act;
      add(text);
    });
    if(state.drawn.length===3){
      const majorCount=state.drawn.filter(item=>item.card.arcana==="大阿尔卡那").length;
      const reverseCount=state.drawn.filter(item=>item.reversed).length;
      const [first,middle,last]=state.drawn;
      const cue=item=>(item.reversed?item.card.rev:item.card.up).split(/[，；。]/)[0];
      let bridge="把三张牌连起来看，"+first.card.name+"提示「"+cue(first)+"」，"+middle.card.name+"让你注意「"+cue(middle)+"」，最后"+last.card.name+"将问题带向「"+cue(last)+"」。";
      if(majorCount>=2)bridge+="这不只是眼前的小插曲，也触及你正在经历的较大转变。";
      else bridge+="线索更多落在日常选择与具体互动中。";
      if(reverseCount>=2)bridge+=" 多张逆位提醒你先辨认卡住的环节，不必急于推动结果。";
      else if(last.reversed)bridge+=" 最后一张牌处于逆位，下一步适合先调整内在阻力，再向外推进。";
      else bridge+=" 顺着最后一张牌的提示，先让下一步清楚起来。";
      add(bridge);
    }
    add("我更想请你想一想："+focus.question);
    add(focus.action+(state.concern?" "+state.concern.step:""));
    add(buildFinalAnswer(),"reading-note");
  }
  function reveal(){
    if(transitionBusy)return;
    if(state.drawn.length!==state.positions.length)return;
    $("result-question").textContent="“"+state.question+"”";
    renderResultCards();
    renderReading();
    show($("result-panel"),"IV · THE READING","reveal");
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
  $("reshuffle").addEventListener("click",()=>resetDraw(true));
  $("reveal").addEventListener("click",reveal);
  const soundToggle=$("sound-toggle");
  function updateSoundToggle(){
    soundToggle.setAttribute("aria-pressed",String(soundEnabled));
    soundToggle.setAttribute("aria-label",soundEnabled?"关闭音效":"开启音效");
    soundToggle.querySelector(".sound-icon").textContent=soundEnabled?"♫":"♪";
    soundToggle.querySelector(".sound-label").textContent=soundEnabled?"音效开":"音效关";
  }
  soundToggle.addEventListener("click",()=>{
    soundEnabled=!soundEnabled;
    updateSoundToggle();
    if(soundEnabled)playSound("page");
  });
  if(!(window.AudioContext||window.webkitAudioContext)){
    soundEnabled=false;
    soundToggle.disabled=true;
    soundToggle.title="当前浏览器不支持音效";
    updateSoundToggle();
  }
  $("new-reading").addEventListener("click",()=>{
    $("question").value="";
    $("char-count").textContent="0 / 180";
    show($("question-panel"),"I · THE QUESTION").then(changed=>{
      if(changed)$("question").focus({preventScroll:true});
    });
  });
  $("about-button").addEventListener("click",()=>$("about-dialog").showModal());
  if(!window.TAROT_DATA||window.TAROT_DATA.length!==78)throw new Error("The tarot deck is incomplete.");
})();

