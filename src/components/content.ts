import { Bi } from "./lang";

/* ============================================================
   HAPPINESS ENGINE — shared bilingual content & data contract
   Every visualization component imports the typed arrays it needs
   from this file. Section ids drive the VIS map in HappinessEngine.tsx.
   ============================================================ */

/* ---------- The ten systems ---------- */
export type Section = { num: string; id: string; title: Bi; sub: Bi; body: Bi };

export const SECTIONS: Section[] = [
  {
    num: "01",
    id: "origin",
    title: { en: "The Origin of Feeling", zh: "感受的起源" },
    sub: { en: "Why anything feels like anything at all", zh: "为何任何事物会带来感受" },
    body: {
      en: "Pleasure and pain are older than thought. Long before language, evolution discovered that the cheapest way to steer a body toward what helps it and away from what harms it was to make those things feel good or bad. Emotion is not decoration on top of survival — it is the steering. Happiness begins as a signal: a verdict the nervous system passes on its own situation.",
      zh: "快乐与痛苦比思想更古老。远在语言之前，进化就发现：要让一具身体趋向有益、远离有害，最廉价的办法，是让这些事物本身变得好受或难受。情绪并非附着在生存之上的装饰——它就是那只舵。幸福，始于一个信号：神经系统对自身处境所下的判决。",
    },
  },
  {
    num: "02",
    id: "pleasure",
    title: { en: "Pleasure vs Meaning", zh: "快乐与意义" },
    sub: { en: "Two different machines, often confused", zh: "两台不同的机器，常被混为一谈" },
    body: {
      en: "Pleasure is a spike; meaning is a slope. The mind adapts to almost any pleasure, dragging satisfaction back to baseline — the hedonic treadmill. Meaning behaves differently: it compounds, survives discomfort, and can make a hard life feel worth living. A flourishing life is not the one with the most pleasure. It is the one where pleasure and meaning are not at war.",
      zh: "快乐是一次尖峰，意义是一道斜坡。心智几乎能适应任何快乐，把满足感拖回基线——这就是「享乐跑步机」。意义则不同：它会复利累积，能在不适中存活，甚至能让一段艰难的人生显得值得。繁盛的人生，不是快乐最多的那一种，而是快乐与意义并不交战的那一种。",
    },
  },
  {
    num: "03",
    id: "brain",
    title: { en: "The Neurochemistry Engine", zh: "神经化学引擎" },
    sub: { en: "Dopamine, serotonin, oxytocin & the chemistry of mood", zh: "多巴胺、血清素、催产素与情绪的化学" },
    body: {
      en: "There is no single 'happiness molecule.' Dopamine is wanting, not liking — the chemistry of pursuit and prediction. Serotonin tracks status, safety and mood-floor. Oxytocin binds us to others. Endorphins blunt pain; cortisol marshals stress. What you call a feeling is a particular chord struck across these systems — and attention decides which notes get played.",
      zh: "并不存在单一的「幸福分子」。多巴胺是「想要」，而非「喜欢」——它是追逐与预测的化学。血清素追踪地位、安全与情绪底线。催产素把我们与他人绑在一起。内啡肽钝化疼痛，皮质醇调动应激。你所谓的某种感受，其实是这些系统上同时奏响的一组和弦——而注意力，决定了哪些音被弹出。",
    },
  },
  {
    num: "04",
    id: "flow",
    title: { en: "Flow & Peak Experience", zh: "心流与巅峰体验" },
    sub: { en: "Joy on the edge of ability", zh: "在能力边缘的喜悦" },
    body: {
      en: "The happiest moments are rarely passive. They arrive when a clear challenge meets a matched skill, attention narrows to a single thread, the self quiets, and time bends. Csíkszentmihályi called it flow. Too much challenge breeds anxiety; too little breeds boredom. Flow lives on the diagonal between them — which is why meaningful difficulty, not ease, is so often the road to joy.",
      zh: "最幸福的时刻，极少是被动的。它们降临于：清晰的挑战恰好遇上匹配的技能，注意力收束成一根线，自我安静下来，时间随之弯折。契克森米哈伊称之为「心流」。挑战过高滋生焦虑，过低滋生厌倦。心流栖居于两者之间的对角线上——这正是为何通往喜悦的路，往往是有意义的困难，而非轻松。",
    },
  },
  {
    num: "05",
    id: "love",
    title: { en: "Love & Belonging", zh: "爱与归属" },
    sub: { en: "We are not solitary happiness machines", zh: "我们不是孤立的幸福机器" },
    body: {
      en: "The longest study of adult life ever run reached one stubborn conclusion: the quality of our relationships predicts wellbeing better than wealth, fame or IQ. We evolved as a social species; warmth, trust and being known are not luxuries on top of survival but a basic nutrient of the mind. Loneliness, accordingly, is not weakness — it is a hunger signal, and a modern epidemic.",
      zh: "有史以来历时最长的成人研究，得出一个顽固的结论：关系的质量，比财富、名声或智商更能预测幸福。我们作为社会性物种进化而来；温暖、信任、被人懂得，并非生存之上的奢侈品，而是心智的基本养分。因此，孤独不是软弱——它是一种饥饿信号，也是一种现代流行病。",
    },
  },
  {
    num: "06",
    id: "suffering",
    title: { en: "Suffering & Its Uses", zh: "苦难及其用途" },
    sub: { en: "Pain is data; suffering is interpretation", zh: "痛苦是数据，苦难是诠释" },
    body: {
      en: "Buddhism speaks of a second arrow: the first is the pain that life fires at us; the second is the one we fire at ourselves, through resistance and story. Stoicism, cognitive therapy, meditation and logotherapy converge on the same hinge — between event and emotion there is a space, and freedom lives there. Suffering, met honestly, can metabolise into depth, compassion and meaning.",
      zh: "佛教讲「第二支箭」：第一支，是生活向我们射来的痛；第二支，是我们借抗拒与故事，射向自己的箭。斯多葛、认知疗法、冥想与意义疗法，都收束于同一个枢纽——在事件与情绪之间，存在一道缝隙，而自由就居于其中。诚实地直面苦难，它能被代谢为深度、慈悲与意义。",
    },
  },
  {
    num: "07",
    id: "civilizations",
    title: { en: "Happiness Across Civilizations", zh: "文明中的幸福" },
    sub: { en: "Five thousand years of competing answers", zh: "五千年里彼此竞争的答案" },
    body: {
      en: "Every great tradition built a different machine for the good life. Aristotle prescribed eudaimonia — flourishing through virtue. Epicurus prized tranquillity. Confucius located joy in right relationship and ritual; the Daoists in flowing with the way; the Buddhists in releasing craving; the Christians in love and grace. Modern psychology measures and tests. Read together, they are not rivals so much as facets.",
      zh: "每一个伟大传统，都为「美好生活」造了一台不同的机器。亚里士多德开出的药方是 eudaimonia——以德性达致繁盛；伊壁鸠鲁珍视宁静；孔子把喜悦安放在恰当的关系与礼之中；道家在于顺道而流；佛家在于放下贪求；基督教在于爱与恩典。现代心理学则去度量、去验证。合而读之，它们与其说是对手，不如说是同一事物的不同切面。",
    },
  },
  {
    num: "08",
    id: "digital",
    title: { en: "The Digital Happiness Machine", zh: "数字幸福机器" },
    sub: { en: "When the reward circuit meets the algorithm", zh: "当奖赏回路遇上算法" },
    body: {
      en: "Feeds, games and notifications are engineered against the same dopamine circuitry that evolution tuned for foraging — variable, intermittent, endless. They are extraordinarily good at capturing wanting, and surprisingly poor at delivering liking. The result is a civilisation that can feel busy, stimulated and lonely at once. The question is no longer whether technology touches happiness, but who is optimising whom.",
      zh: "信息流、游戏与推送，正是针对进化为「觅食」所调校的同一套多巴胺回路而设计的——可变、间歇、无尽。它们极擅长捕获「想要」，却出奇地拙于交付「喜欢」。其结果，是一个能同时感到忙碌、亢奋而孤独的文明。问题已不再是技术是否触及幸福，而是：究竟谁在优化谁。",
    },
  },
  {
    num: "09",
    id: "future",
    title: { en: "Future Flourishing", zh: "未来的繁盛" },
    sub: { en: "Engineering wellbeing — and what we might lose", zh: "设计幸福——以及我们可能失去什么" },
    body: {
      en: "Soon we will not merely treat suffering but engineer surplus: AI companions that listen without fatigue, brain-computer interfaces that tune mood, drugs and rituals dialled to the receptor, post-scarcity economies that remove old constraints. Each promise carries a shadow. If contentment becomes a setting, what happens to striving, to grief, to meaning? Flourishing may turn out to require the very friction we are tempted to remove.",
      zh: "不久，我们将不只是治疗苦难，而是去设计「盈余」：不知疲倦地倾听的 AI 伴侣、可调情绪的脑机接口、精确作用于受体的药物与仪式、消除旧约束的后稀缺经济。每一份允诺都带着阴影。若满足成了一个旋钮，那么奋斗、悲伤、意义将何去何从？繁盛，或许恰恰需要我们正想抹去的那份摩擦。",
    },
  },
  {
    num: "10",
    id: "unified",
    title: { en: "The Unified Flourishing Model", zh: "统一繁盛模型" },
    sub: { en: "Happiness as alignment, not sensation", zh: "幸福，是对齐，而非感觉" },
    body: {
      en: "Gather the threads — neuroscience, philosophy, contemplative practice, relationship, meaning — and a single shape appears. Happiness, in the deepest sense, is less a feeling than a fit: a coherence between self, others, purpose and reality. Pleasure is its weather; meaning is its climate. Flourishing is what happens when consciousness stops fighting the world it finds itself in, and begins, instead, to align with it.",
      zh: "把这些线索聚拢起来——神经科学、哲学、修行、关系、意义——一个统一的形状便浮现出来。最深意义上的幸福，与其说是一种感觉，不如说是一种「契合」：自我、他人、目的与现实之间的连贯一致。快乐是它的天气，意义是它的气候。当意识不再与它所身处的世界相争，转而开始与之对齐时，繁盛便发生了。",
    },
  },
];

/* ---------- Per-section concept cards (sub-ideas, 4 each) ---------- */
export type Concept = { t: Bi; d: Bi };

export const CONCEPTS: Record<string, Concept[]> = {
  origin: [
    { t: { en: "Valence", zh: "效价" }, d: { en: "The good/bad axis — the brain's most basic verdict, present even in a worm turning from heat.", zh: "好/坏的轴——大脑最基本的判决，连一条避开高温的虫子身上也已存在。" } },
    { t: { en: "Homeostasis", zh: "稳态" }, d: { en: "Feelings track the body's needs: hunger, cold, fatigue, threat. Emotion is the body reporting on itself.", zh: "感受追踪身体的需求：饥饿、寒冷、疲惫、威胁。情绪，是身体在汇报自身。" } },
    { t: { en: "Attachment", zh: "依恋" }, d: { en: "Mammals evolved separation distress and reunion joy — love is older than humanity.", zh: "哺乳动物进化出分离的痛苦与重聚的喜悦——爱，比人类更古老。" } },
    { t: { en: "Prediction", zh: "预测" }, d: { en: "Much of feeling is forecast error: we feel the gap between what we expected and what arrived.", zh: "大半的感受是「预测误差」：我们感到的，是期待与所得之间的落差。" } },
  ],
  pleasure: [
    { t: { en: "Hedonic treadmill", zh: "享乐跑步机" }, d: { en: "Win, lose, recover — most life events fade back to a personal baseline within months.", zh: "得意、失意、复原——多数人生事件，在数月内便淡回个人的基线。" } },
    { t: { en: "Eudaimonia", zh: "幸福繁盛" }, d: { en: "Aristotle's 'flourishing through excellence' — well-being as activity, not as a mood.", zh: "亚里士多德的「以卓越达致繁盛」——幸福是一种活动，而非一种心境。" } },
    { t: { en: "Anticipation", zh: "期待" }, d: { en: "The savouring before often exceeds the having — wanting and liking are different organs.", zh: "事前的回味，常胜过拥有本身——「想要」与「喜欢」是不同的器官。" } },
    { t: { en: "Diminishing returns", zh: "边际递减" }, d: { en: "Above a modest threshold, more money buys steeply less additional happiness.", zh: "越过一道不高的门槛后，更多的金钱所能买到的额外幸福急剧变少。" } },
  ],
  brain: [
    { t: { en: "Wanting ≠ liking", zh: "想要 ≠ 喜欢" }, d: { en: "Dopamine drives pursuit; opioids and endocannabinoids deliver the actual pleasure of consumption.", zh: "多巴胺驱动追逐；阿片肽与内源性大麻素，才交付消费时真正的愉悦。" } },
    { t: { en: "Set point", zh: "幸福定点" }, d: { en: "Roughly half of trait happiness is heritable — but the rest is reachable by what we do.", zh: "约一半的特质性幸福是遗传的——而另一半，可由我们的所作所为触及。" } },
    { t: { en: "Neuroplasticity", zh: "神经可塑性" }, d: { en: "Repeated states carve traits. Attention is a chisel; practice rewires the baseline.", zh: "反复的状态，刻成特质。注意力是刻刀，练习重塑基线。" } },
    { t: { en: "The default mode", zh: "默认模式网络" }, d: { en: "The mind's idling network spins self-story and rumination — quieted in flow and meditation.", zh: "大脑空转时的网络，编织自我叙事与反刍——在心流与冥想中归于安静。" } },
  ],
  flow: [
    { t: { en: "Challenge–skill balance", zh: "挑战—技能平衡" }, d: { en: "Flow appears where difficulty stretches ability without snapping it.", zh: "心流出现在：难度拉伸能力，却不至于将其拉断之处。" } },
    { t: { en: "Autotelic", zh: "自带目的" }, d: { en: "An activity worth doing for itself — the reward is the doing, not the prize.", zh: "一件值得为其自身而做的事——奖赏在于「做」，而非奖品。" } },
    { t: { en: "Loss of self", zh: "自我消融" }, d: { en: "The inner narrator goes quiet; the gap between you and the task closes.", zh: "内在的叙述者归于沉默；你与任务之间的间隙合拢。" } },
    { t: { en: "Time dilation", zh: "时间膨胀" }, d: { en: "Hours vanish or a second stretches — clock-time loosens its grip in deep focus.", zh: "数小时消失，或一秒被拉长——在深度专注中，钟表时间松开了它的掌控。" } },
  ],
  love: [
    { t: { en: "Dunbar's circles", zh: "邓巴圈层" }, d: { en: "Intimates, friends, community, acquaintances — concentric layers of belonging with natural limits.", zh: "至亲、朋友、社群、相识——归属感的同心圈层，各有其天然的上限。" } },
    { t: { en: "Co-regulation", zh: "共同调节" }, d: { en: "Nervous systems calm each other; a steady presence is itself a kind of medicine.", zh: "神经系统彼此安抚；一个稳定的在场，本身就是一味药。" } },
    { t: { en: "Being known", zh: "被懂得" }, d: { en: "To be seen accurately and accepted anyway is among the deepest human goods.", zh: "被准确地看见，又依然被接纳——这是人类最深的善之一。" } },
    { t: { en: "The loneliness epidemic", zh: "孤独流行病" }, d: { en: "Connected to everyone, close to fewer — digital ties can starve the appetite they feign to feed.", zh: "与所有人相连，却与更少的人亲近——数字连接，可能饿坏了它佯装在喂养的那份胃口。" } },
  ],
  suffering: [
    { t: { en: "The second arrow", zh: "第二支箭" }, d: { en: "Pain is unavoidable; the suffering we add through resistance is optional.", zh: "痛苦无可避免；而我们借抗拒所添上的苦，是可选的。" } },
    { t: { en: "The dichotomy of control", zh: "控制二分法" }, d: { en: "Stoicism: sort the world into what is yours to change and what is not, then act accordingly.", zh: "斯多葛：把世界分为「你能改变的」与「不能改变的」，再据此而行。" } },
    { t: { en: "Post-traumatic growth", zh: "创伤后成长" }, d: { en: "Many emerge from crisis with deeper relationships, priorities and strength — not despite pain, but through it.", zh: "许多人在危机后获得更深的关系、更清的优先与更强的韧性——不是绕过痛苦，而是穿越它。" } },
    { t: { en: "Acceptance", zh: "接纳" }, d: { en: "Not approval, but ceasing the war with what already is — the ground from which change becomes possible.", zh: "并非赞同，而是停止与「已然如此」的交战——改变得以发生的土壤。" } },
  ],
  civilizations: [
    { t: { en: "Eudaimonia", zh: "幸福繁盛" }, d: { en: "Greek: the good life is virtuous activity of the soul, realised over a whole lifetime.", zh: "希腊：美好生活，是灵魂依德性而展开的活动，在一生的尺度上实现。" } },
    { t: { en: "Ren & li 仁与礼", zh: "仁与礼" }, d: { en: "Confucian joy is found in benevolence and in the right ordering of human relationships.", zh: "儒家的喜悦，存于仁爱，与人伦关系的恰当秩序之中。" } },
    { t: { en: "Wu wei 无为", zh: "无为" }, d: { en: "Daoist ease: effortless action, moving with the grain of things rather than against it.", zh: "道家的自在：无为而为，顺物之纹理而动，而非逆之。" } },
    { t: { en: "Nirodha 离苦", zh: "灭" }, d: { en: "Buddhist liberation: suffering ends when craving and clinging are released.", zh: "佛家的解脱：当贪求与执取被放下时，苦便止息。" } },
  ],
  digital: [
    { t: { en: "Variable rewards", zh: "可变奖赏" }, d: { en: "Unpredictable payoffs hook attention hardest — the slot-machine logic of the feed.", zh: "不可预测的回报，最牢地钩住注意力——这是信息流的老虎机逻辑。" } },
    { t: { en: "Comparison engines", zh: "比较引擎" }, d: { en: "Curated highlight reels recalibrate expectations upward, manufacturing quiet dissatisfaction.", zh: "经过精修的高光集锦，把期待向上重新校准，制造出无声的不满。" } },
    { t: { en: "Attention as the product", zh: "注意力即商品" }, d: { en: "When the service is free, your gaze is the thing being sold — wellbeing is not the metric optimised.", zh: "当服务免费时，被出售的，是你的目光——幸福，从来不是被优化的那个指标。" } },
    { t: { en: "Synthetic intimacy", zh: "合成亲密" }, d: { en: "AI companions never tire or judge — comfort without friction, and connection without another mind.", zh: "AI 伴侣从不疲惫、从不评判——这是无摩擦的慰藉，也是没有另一个心智的连接。" } },
  ],
  future: [
    { t: { en: "Mood as a dial", zh: "情绪旋钮" }, d: { en: "If contentment becomes adjustable, does it still mean what it meant when it was earned?", zh: "若满足变得可调，它是否还保有「挣得」之时所拥有的意义？" } },
    { t: { en: "The experience machine", zh: "体验机器" }, d: { en: "Nozick asked: would you plug into guaranteed bliss? Most refuse — we want reality, not just its feeling.", zh: "诺齐克之问：你愿接入保证的极乐吗？多数人拒绝——我们要的是现实，而不只是它的感觉。" } },
    { t: { en: "Augmented empathy", zh: "增强的共情" }, d: { en: "Interfaces that read and share emotion could deepen bonds — or hollow out their privacy.", zh: "能读取并共享情绪的接口，可能加深羁绊——也可能掏空它的私密。" } },
    { t: { en: "Post-scarcity meaning", zh: "后稀缺的意义" }, d: { en: "When survival is solved, the hard problem is no longer comfort but purpose.", zh: "当生存被解决，真正棘手的，不再是舒适，而是目的。" } },
  ],
  unified: [
    { t: { en: "Coherence", zh: "连贯" }, d: { en: "Flourishing is a fit between inner states, outer life and shared reality — alignment, not amplitude.", zh: "繁盛，是内在状态、外在生活与共享现实之间的契合——是对齐，而非振幅。" } },
    { t: { en: "Weather vs climate", zh: "天气与气候" }, d: { en: "Pleasure is the day's mood; meaning is the long season. Build for climate.", zh: "快乐是当日的心情，意义是漫长的季候。要为气候而建。" } },
    { t: { en: "Practice over insight", zh: "练习胜于顿悟" }, d: { en: "Knowing the model changes little; rehearsing the states rewires the baseline.", zh: "懂得模型，几乎改变不了什么；反复演练那些状态，才能重塑基线。" } },
    { t: { en: "Self in service", zh: "自我在服务中" }, d: { en: "Paradoxically, aiming past the self — at others, craft, truth — is where the self finds rest.", zh: "悖论在于：把目标越过自我——投向他人、技艺、真理——恰是自我得以安歇之处。" } },
  ],
};

/* ---------- EmotionMap — valence/arousal circumplex ---------- */
export type Emotion = {
  key: string;
  name: Bi;
  valence: number; // -100 (unpleasant) … +100 (pleasant)
  arousal: number; // -100 (low energy) … +100 (high energy)
  color: string;
  note: Bi;
};

export const EMOTIONS: Emotion[] = [
  { key: "joy", name: { en: "Joy", zh: "喜悦" }, valence: 82, arousal: 55, color: "#ffb86b", note: { en: "High pleasure, high energy — dopamine and endorphins together.", zh: "高愉悦、高能量——多巴胺与内啡肽同奏。" } },
  { key: "ecstasy", name: { en: "Ecstasy", zh: "狂喜" }, valence: 90, arousal: 85, color: "#ff9e4f", note: { en: "Peak rapture — rare, brief, and chemically expensive.", zh: "极致的狂喜——稀有、短暂，且在化学上代价高昂。" } },
  { key: "serenity", name: { en: "Serenity", zh: "宁静" }, valence: 70, arousal: -55, color: "#6ee9d4", note: { en: "Pleasant and calm — the signature of serotonin and safety.", zh: "愉悦而平静——血清素与安全感的标记。" } },
  { key: "contentment", name: { en: "Contentment", zh: "知足" }, valence: 62, arousal: -25, color: "#9af2e3", note: { en: "Enough-ness. The quiet baseline a good life returns to.", zh: "「够了」之感。美好生活所回归的安静基线。" } },
  { key: "love", name: { en: "Love", zh: "爱" }, valence: 80, arousal: 20, color: "#ff8c9e", note: { en: "Warm, bonding, oxytocin-rich — pleasant at gentle arousal.", zh: "温暖、联结、富含催产素——在温和的唤起中令人愉悦。" } },
  { key: "awe", name: { en: "Awe", zh: "敬畏" }, valence: 55, arousal: 35, color: "#c0a3ff", note: { en: "Vastness that shrinks the self and widens time.", zh: "一种使自我缩小、使时间变宽的浩瀚。" } },
  { key: "interest", name: { en: "Curiosity", zh: "好奇" }, valence: 45, arousal: 45, color: "#ffd29a", note: { en: "The pull toward the unknown — engine of learning and play.", zh: "对未知的牵引——学习与玩耍的引擎。" } },
  { key: "pride", name: { en: "Pride", zh: "自豪" }, valence: 58, arousal: 40, color: "#ffb3bf", note: { en: "Reward of mastery and recognition — fuel and, in excess, trap.", zh: "精通与被认可的奖赏——是燃料，过量则成陷阱。" } },
  { key: "boredom", name: { en: "Boredom", zh: "无聊" }, valence: -25, arousal: -45, color: "#a08a82", note: { en: "Low challenge, low meaning — a prompt to seek or to create.", zh: "低挑战、低意义——一道催促你去寻找或创造的提示。" } },
  { key: "sadness", name: { en: "Sadness", zh: "悲伤" }, valence: -65, arousal: -50, color: "#a87fff", note: { en: "The cost of love and loss — slows us to integrate what changed.", zh: "爱与失去的代价——它让我们慢下来，去整合所变之物。" } },
  { key: "fear", name: { en: "Fear", zh: "恐惧" }, valence: -70, arousal: 70, color: "#ff6b81", note: { en: "Threat alarm — cortisol and adrenaline mobilising the body.", zh: "威胁警报——皮质醇与肾上腺素动员全身。" } },
  { key: "anger", name: { en: "Anger", zh: "愤怒" }, valence: -55, arousal: 75, color: "#ff7a52", note: { en: "Boundary violated — energy to push back, easily misfired.", zh: "边界被侵——一种反击的能量，也极易误发。" } },
  { key: "anxiety", name: { en: "Anxiety", zh: "焦虑" }, valence: -50, arousal: 60, color: "#ff8c9e", note: { en: "Fear without a clear object — challenge outrunning resources.", zh: "没有清晰对象的恐惧——挑战跑赢了资源。" } },
  { key: "calm", name: { en: "Stillness", zh: "安然" }, valence: 40, arousal: -70, color: "#3dd6bd", note: { en: "Deep rest — parasympathetic, the ground of recovery.", zh: "深度休息——副交感主导，是复原的根基。" } },
];

/* ---------- NeuroLab — the chemistry of mood ---------- */
export type Neuro = {
  key: string;
  name: Bi;
  symbol: string;
  color: string;
  role: Bi;
  high: Bi;
  low: Bi;
  lift: Bi;
};

export const NEUROCHEMICALS: Neuro[] = [
  {
    key: "dopamine",
    name: { en: "Dopamine", zh: "多巴胺" },
    symbol: "DA",
    color: "#ffb86b",
    role: { en: "Wanting, pursuit, reward prediction. The chemistry of the chase — not of the catch.", zh: "想要、追逐、奖赏预测。是追逐的化学——而非捕获的化学。" },
    high: { en: "Drive, focus, craving; in excess, restlessness and addiction.", zh: "动力、专注、渴求；过量则躁动与成瘾。" },
    low: { en: "Apathy, anhedonia, the world goes grey and effort feels pointless.", zh: "冷漠、快感缺失；世界褪成灰色，努力显得徒劳。" },
    lift: { en: "Small finished goals, novelty, movement, morning light.", zh: "完成小目标、新鲜事物、运动、晨光。" },
  },
  {
    key: "serotonin",
    name: { en: "Serotonin", zh: "血清素" },
    symbol: "5-HT",
    color: "#6ee9d4",
    role: { en: "Mood-floor, status, satiety and patience. The chemistry of 'enough.'", zh: "情绪底线、地位、饱足与耐心。是「够了」的化学。" },
    high: { en: "Calm confidence, contentment, the ability to wait.", zh: "从容的自信、知足、等待的能力。" },
    low: { en: "Irritability, rumination, low mood and impulsivity.", zh: "易怒、反刍、低落与冲动。" },
    lift: { en: "Sunlight, gratitude, accomplishment recalled, secure status.", zh: "日照、感恩、回想成就、稳固的地位感。" },
  },
  {
    key: "oxytocin",
    name: { en: "Oxytocin", zh: "催产素" },
    symbol: "OT",
    color: "#ff8c9e",
    role: { en: "Bonding, trust, warmth. The chemistry that makes other minds matter.", zh: "联结、信任、温暖。是让「他者之心」变得重要的化学。" },
    high: { en: "Closeness, generosity, safety in the presence of others.", zh: "亲近、慷慨、在他人在场时的安全感。" },
    low: { en: "Isolation, distrust, the ache of disconnection.", zh: "孤立、不信任、失联的隐痛。" },
    lift: { en: "Touch, eye contact, deep conversation, caring for someone.", zh: "触碰、对视、深入的交谈、照顾某个人。" },
  },
  {
    key: "endorphin",
    name: { en: "Endorphins", zh: "内啡肽" },
    symbol: "β-EP",
    color: "#ffd29a",
    role: { en: "The body's own opioids — pain relief and the warm flood of liking.", zh: "身体自产的阿片类——镇痛，与「喜欢」时那股温暖的涌流。" },
    high: { en: "The runner's high, laughter, the glow after effort.", zh: "跑者的愉悦、大笑、用力之后的暖光。" },
    low: { en: "Heightened pain, flatness, joylessness.", zh: "疼痛被放大、平淡、无乐。" },
    lift: { en: "Exercise, laughter, music, a hot bath, crying it out.", zh: "运动、大笑、音乐、热水浴、痛快一哭。" },
  },
  {
    key: "cortisol",
    name: { en: "Cortisol", zh: "皮质醇" },
    symbol: "CORT",
    color: "#ff6b81",
    role: { en: "Stress mobiliser. Useful in pulses, corrosive when chronic.", zh: "应激动员者。脉冲式有用，长期化则具腐蚀性。" },
    high: { en: "Vigilance, sleeplessness, anxiety; long-term, it erodes mood and health.", zh: "警觉、失眠、焦虑；长期则侵蚀情绪与健康。" },
    low: { en: "Calm, but too low blunts the morning's mobilising lift.", zh: "平静，但过低会削弱清晨那股动员的提振。" },
    lift: { en: "Lowered by sleep, breath, nature, and a sense of control.", zh: "睡眠、呼吸、自然，与一份掌控感，可使之下降。" },
  },
  {
    key: "gaba",
    name: { en: "GABA", zh: "γ-氨基丁酸" },
    symbol: "GABA",
    color: "#3dd6bd",
    role: { en: "The brain's brake — inhibition, calm, the off-switch on overthinking.", zh: "大脑的刹车——抑制、平静，是过度思虑的关闭开关。" },
    high: { en: "Relaxation, ease, the loosening of anxious grip.", zh: "放松、自在，焦虑紧握的松开。" },
    low: { en: "Racing thoughts, tension, difficulty winding down.", zh: "思绪奔涌、紧绷、难以平复。" },
    lift: { en: "Slow breathing, meditation, rhythm, and rest.", zh: "缓慢呼吸、冥想、节律，与休息。" },
  },
];

/* ---------- CivilizationsModel — wellbeing traditions ---------- */
export type WellAxis = { key: string; label: Bi };
export const WELLBEING_AXES: WellAxis[] = [
  { key: "pleasure", label: { en: "Pleasure", zh: "快乐" } },
  { key: "virtue", label: { en: "Virtue", zh: "德性" } },
  { key: "detach", label: { en: "Detachment", zh: "超然" } },
  { key: "harmony", label: { en: "Harmony", zh: "和谐" } },
  { key: "community", label: { en: "Community", zh: "群体" } },
  { key: "transcend", label: { en: "Transcendence", zh: "超越" } },
  { key: "acceptance", label: { en: "Acceptance", zh: "接纳" } },
];

export type Tradition = {
  key: string;
  name: Bi;
  era: Bi;
  aim: Bi;
  path: Bi;
  idea: Bi;
  color: string;
  scores: Record<string, number>; // keyed by WELLBEING_AXES.key, 0–100
};

export const TRADITIONS: Tradition[] = [
  {
    key: "aristotle",
    name: { en: "Aristotelian", zh: "亚里士多德" },
    era: { en: "Greece · 4th c. BCE", zh: "希腊 · 公元前 4 世纪" },
    aim: { en: "Eudaimonia — flourishing", zh: "Eudaimonia — 繁盛" },
    path: { en: "Cultivate virtue and practical wisdom across a whole life.", zh: "以一生之久，培育德性与实践智慧。" },
    idea: { en: "Happiness is not a feeling but an activity: the soul performing its function well.", zh: "幸福不是一种感觉，而是一种活动：灵魂出色地履行其功能。" },
    color: "#ffb86b",
    scores: { pleasure: 45, virtue: 95, detach: 40, harmony: 70, community: 80, transcend: 50, acceptance: 55 },
  },
  {
    key: "epicurus",
    name: { en: "Epicurean", zh: "伊壁鸠鲁" },
    era: { en: "Greece · 3rd c. BCE", zh: "希腊 · 公元前 3 世纪" },
    aim: { en: "Ataraxia — tranquillity", zh: "Ataraxia — 宁静" },
    path: { en: "Seek simple pleasures, friendship, and freedom from fear and want.", zh: "追求简朴的快乐、友谊，与免于恐惧和匮乏的自由。" },
    idea: { en: "The absence of pain is itself the deepest pleasure — desire less, not more.", zh: "痛苦的缺席，本身就是最深的快乐——欲求更少，而非更多。" },
    color: "#ffd29a",
    scores: { pleasure: 80, virtue: 55, detach: 65, harmony: 60, community: 65, transcend: 30, acceptance: 70 },
  },
  {
    key: "confucian",
    name: { en: "Confucian", zh: "儒家" },
    era: { en: "China · 5th c. BCE", zh: "中国 · 公元前 5 世纪" },
    aim: { en: "Joy in right relationship", zh: "在恰当关系中的喜悦" },
    path: { en: "Cultivate ren (benevolence) and li (ritual); harmonise the human order.", zh: "修「仁」与「礼」；和谐人伦秩序。" },
    idea: { en: "The good life is found in family, learning, and the proper ordering of relationships.", zh: "美好生活，存于家庭、学习，与关系的恰当秩序之中。" },
    color: "#ff8c9e",
    scores: { pleasure: 50, virtue: 90, detach: 35, harmony: 95, community: 95, transcend: 40, acceptance: 55 },
  },
  {
    key: "daoist",
    name: { en: "Daoist", zh: "道家" },
    era: { en: "China · 4th c. BCE", zh: "中国 · 公元前 4 世纪" },
    aim: { en: "Flowing with the Way", zh: "顺道而流" },
    path: { en: "Wu wei — effortless action; align with nature rather than force it.", zh: "无为——顺势而为；与自然对齐，而非强求。" },
    idea: { en: "Happiness is ease: ceasing to struggle against the grain of things.", zh: "幸福即自在：停止逆物之纹理而挣扎。" },
    color: "#6ee9d4",
    scores: { pleasure: 55, virtue: 50, detach: 80, harmony: 90, community: 45, transcend: 70, acceptance: 90 },
  },
  {
    key: "buddhist",
    name: { en: "Buddhist", zh: "佛家" },
    era: { en: "India · 5th c. BCE", zh: "印度 · 公元前 5 世纪" },
    aim: { en: "Liberation from suffering", zh: "离苦得解脱" },
    path: { en: "See impermanence clearly; release craving and clinging through the eightfold path.", zh: "如实见无常；循八正道，放下贪求与执取。" },
    idea: { en: "Suffering is born of craving; freedom is the cessation of that grasping.", zh: "苦生于贪求；解脱，是那份攫取的止息。" },
    color: "#a87fff",
    scores: { pleasure: 30, virtue: 80, detach: 95, harmony: 70, community: 60, transcend: 95, acceptance: 95 },
  },
  {
    key: "christian",
    name: { en: "Christian", zh: "基督教" },
    era: { en: "Mediterranean · 1st c. CE", zh: "地中海 · 公元 1 世纪" },
    aim: { en: "Beatitude — joy in grace", zh: "至福——在恩典中的喜乐" },
    path: { en: "Love of God and neighbour; meaning through faith, hope and charity.", zh: "爱神与爱邻；借信、望、爱而得意义。" },
    idea: { en: "Joy is found not in getting but in giving and being held by something larger.", zh: "喜乐不在于获取，而在于给予，与被一个更大者所托住。" },
    color: "#ffb3bf",
    scores: { pleasure: 40, virtue: 85, detach: 55, harmony: 75, community: 90, transcend: 90, acceptance: 75 },
  },
  {
    key: "modern",
    name: { en: "Positive psychology", zh: "积极心理学" },
    era: { en: "West · 21st c. CE", zh: "西方 · 21 世纪" },
    aim: { en: "Measurable well-being", zh: "可度量的幸福" },
    path: { en: "PERMA: positive emotion, engagement, relationships, meaning, accomplishment.", zh: "PERMA：正向情绪、投入、关系、意义、成就。" },
    idea: { en: "Well-being is buildable and testable — many ancient claims now have evidence.", zh: "幸福可建造、可检验——许多古老的论断，如今有了证据。" },
    color: "#9af2e3",
    scores: { pleasure: 65, virtue: 60, detach: 40, harmony: 65, community: 80, transcend: 45, acceptance: 70 },
  },
];

/* ---------- FlourishingModel — the meta-model (8 axes) ---------- */
export type FlourishDim = { key: string; label: Bi; desc: Bi; color: string };
export const FLOURISH_DIMS: FlourishDim[] = [
  { key: "stability", label: { en: "Emotional stability", zh: "情绪稳定" }, desc: { en: "A steady baseline that recovers from shocks.", zh: "能从冲击中复原的稳定基线。" }, color: "#6ee9d4" },
  { key: "meaning", label: { en: "Meaning", zh: "意义" }, desc: { en: "A sense that your life matters and connects to something larger.", zh: "你的人生重要、且与更大之物相连的感受。" }, color: "#a87fff" },
  { key: "connection", label: { en: "Social connection", zh: "社会连接" }, desc: { en: "Warm, trusting bonds in which you are known.", zh: "温暖、信任、且被懂得的羁绊。" }, color: "#ff8c9e" },
  { key: "curiosity", label: { en: "Curiosity", zh: "好奇" }, desc: { en: "Openness, wonder, and the appetite to learn.", zh: "开放、惊奇，与求知的胃口。" }, color: "#ffd29a" },
  { key: "purpose", label: { en: "Purpose", zh: "目的" }, desc: { en: "Goals worth pursuing that organise your days.", zh: "值得追求、能组织你日常的目标。" }, color: "#ffb86b" },
  { key: "freedom", label: { en: "Freedom", zh: "自由" }, desc: { en: "Autonomy — the felt sense of authoring your own life.", zh: "自主——切身地感到自己是人生的作者。" }, color: "#ff9e4f" },
  { key: "growth", label: { en: "Growth", zh: "成长" }, desc: { en: "Becoming more capable, wise, and whole over time.", zh: "随时间而更有能力、更有智慧、更趋完整。" }, color: "#ffb3bf" },
  { key: "integration", label: { en: "Consciousness integration", zh: "意识整合" }, desc: { en: "Inner coherence — body, mind and attention at peace with reality.", zh: "内在的连贯——身、心、注意力，与现实和解。" }, color: "#d8c6ff" },
];

export type FlourishPreset = { key: string; name: Bi; note: Bi; values: number[] };
// values align to FLOURISH_DIMS order
export const FLOURISH_PRESETS: FlourishPreset[] = [
  { key: "hedonist", name: { en: "The Hedonist", zh: "享乐者" }, note: { en: "Maximises pleasure, thin on meaning and growth.", zh: "极大化快乐，而意义与成长单薄。" }, values: [55, 30, 50, 60, 35, 75, 35, 40] },
  { key: "monk", name: { en: "The Contemplative", zh: "修行者" }, note: { en: "Deep inner peace and meaning; lighter on worldly connection.", zh: "深邃的内在平静与意义；世俗连接较轻。" }, values: [90, 85, 55, 60, 65, 70, 75, 95] },
  { key: "achiever", name: { en: "The Achiever", zh: "成就者" }, note: { en: "Driven and purposeful, but fragile under stress.", zh: "充满动力与目的，却在压力下脆弱。" }, values: [45, 70, 55, 70, 95, 65, 80, 45] },
  { key: "connected", name: { en: "The Connected", zh: "连结者" }, note: { en: "Rich in love and belonging — the strongest single predictor.", zh: "在爱与归属上富足——最强的单一预测因子。" }, values: [75, 70, 95, 65, 60, 60, 65, 70] },
  { key: "flourishing", name: { en: "The Flourishing", zh: "繁盛者" }, note: { en: "Not maximal on any axis — balanced and coherent across all.", zh: "在任一轴上都非最高——而是全面的均衡与连贯。" }, values: [82, 85, 85, 80, 82, 78, 85, 85] },
];

/* ---------- PleasureMeaning — what you pursue ---------- */
export type Pursuit = {
  key: string;
  name: Bi;
  hedonic: number;     // 0–100 immediate pleasure intensity
  eudaimonic: number;  // 0–100 lasting-meaning contribution
  decay: number;       // 0–1 how fast the pleasure fades (1 = vanishes fast)
  note: Bi;
  color: string;
};
export const PURSUITS: Pursuit[] = [
  { key: "novelty", name: { en: "Novelty & thrills", zh: "新奇与刺激" }, hedonic: 90, eudaimonic: 20, decay: 0.9, note: { en: "Bright, fast, and quick to fade — the classic treadmill.", zh: "明亮、迅捷，且消退极快——典型的跑步机。" }, color: "#ffb86b" },
  { key: "comfort", name: { en: "Comfort & ease", zh: "舒适与安逸" }, hedonic: 65, eudaimonic: 25, decay: 0.7, note: { en: "Pleasant, but too much erodes the resilience meaning needs.", zh: "令人愉悦，但过量会侵蚀意义所需的韧性。" }, color: "#ffd29a" },
  { key: "status", name: { en: "Status & wealth", zh: "地位与财富" }, hedonic: 70, eudaimonic: 35, decay: 0.8, note: { en: "Strong pull, steep adaptation — the goalpost always moves.", zh: "牵引强烈，适应陡峭——球门总在移动。" }, color: "#ff8c9e" },
  { key: "mastery", name: { en: "Craft & mastery", zh: "技艺与精通" }, hedonic: 55, eudaimonic: 80, decay: 0.4, note: { en: "Effortful joy that deepens — the flow path to meaning.", zh: "需努力的喜悦，且愈久愈深——通往意义的心流之路。" }, color: "#6ee9d4" },
  { key: "connection", name: { en: "Love & connection", zh: "爱与连接" }, hedonic: 75, eudaimonic: 90, decay: 0.3, note: { en: "Both pleasant now and meaningful for life — the rare both.", zh: "既当下愉悦、又终生有意义——罕见的「两者兼得」。" }, color: "#ffb3bf" },
  { key: "service", name: { en: "Service & contribution", zh: "服务与贡献" }, hedonic: 45, eudaimonic: 95, decay: 0.2, note: { en: "Modest spike, enormous slope — meaning that outlasts you.", zh: "尖峰平缓，斜坡巨大——比你更长久的意义。" }, color: "#a87fff" },
  { key: "transcend", name: { en: "Contemplation & transcendence", zh: "沉思与超越" }, hedonic: 50, eudaimonic: 92, decay: 0.25, note: { en: "Awe and stillness that recalibrate the whole self.", zh: "敬畏与寂静，重新校准整个自我。" }, color: "#d8c6ff" },
];

/* ---------- RelationshipWeb — concentric layers of belonging ---------- */
export type RelationLayer = { key: string; name: Bi; count: Bi; warmth: number; note: Bi; color: string };
export const RELATION_LAYERS: RelationLayer[] = [
  { key: "self", name: { en: "Self", zh: "自我" }, count: { en: "1", zh: "1" }, warmth: 100, note: { en: "The relationship every other rests on — self-compassion first.", zh: "其余一切关系所依凭的那一段——自我慈悲为先。" }, color: "#ffd29a" },
  { key: "intimate", name: { en: "Intimates", zh: "至亲" }, count: { en: "~5", zh: "约 5 人" }, warmth: 95, note: { en: "The inner few who co-regulate your nervous system.", zh: "那少数几人，与你的神经系统共同调节。" }, color: "#ff8c9e" },
  { key: "friends", name: { en: "Close friends", zh: "密友" }, count: { en: "~15", zh: "约 15 人" }, warmth: 75, note: { en: "Those you'd call in a crisis; trust without performance.", zh: "危机时你会致电之人；无需表演的信任。" }, color: "#ffb3bf" },
  { key: "community", name: { en: "Community", zh: "社群" }, count: { en: "~50–150", zh: "约 50–150 人" }, warmth: 50, note: { en: "Dunbar's number — the tribe you can actually know.", zh: "邓巴数——你真正能认识的那个部落。" }, color: "#6ee9d4" },
  { key: "humanity", name: { en: "Humanity", zh: "众生" }, count: { en: "8 billion", zh: "80 亿" }, warmth: 30, note: { en: "The widening circle of moral concern — compassion at scale.", zh: "道德关怀不断扩展的圈层——大尺度上的慈悲。" }, color: "#a87fff" },
];

/* ---------- DigitalLoop — patterns of the attention economy ---------- */
export const DIGITAL_PATTERNS: Concept[] = CONCEPTS.digital;

/* ---------- SufferingLab — lenses on pain ---------- */
export type SufferLens = { key: string; name: Bi; stance: Bi; reframe: Bi; color: string };
export const SUFFER_LENSES: SufferLens[] = [
  { key: "buddhist", name: { en: "Buddhism", zh: "佛教" }, stance: { en: "Release the second arrow", zh: "放下第二支箭" }, reframe: { en: "The event is the first arrow. Your resistance — the story that this must not be — is the second, and it is optional. Notice the grasping, and loosen it.", zh: "事件是第一支箭。你的抗拒——那个「此事绝不该发生」的故事——是第二支，而它是可选的。看见那份攫取，并将它松开。" }, color: "#a87fff" },
  { key: "stoic", name: { en: "Stoicism", zh: "斯多葛" }, stance: { en: "Sort by control", zh: "按可控性分类" }, reframe: { en: "Ask of this only: is it up to me? Pour energy into your response, the one thing fully yours, and release the rest with equanimity.", zh: "对此只问一句：它取决于我吗？把能量倾注于你的回应——那唯一全然属你之物——其余的，以平静放手。" }, color: "#6ee9d4" },
  { key: "cbt", name: { en: "Cognitive therapy", zh: "认知疗法" }, stance: { en: "Audit the thought", zh: "审视那个念头" }, reframe: { en: "The feeling follows the interpretation, not the event. Catch the automatic thought, test it against evidence, and rewrite the distortion.", zh: "感受跟随的是诠释，而非事件。捕捉那个自动念头，用证据检验它，再改写其中的扭曲。" }, color: "#ffd29a" },
  { key: "meditation", name: { en: "Meditation", zh: "冥想" }, stance: { en: "Make room for it", zh: "为它腾出空间" }, reframe: { en: "Stop fighting the sensation. Turn toward it with curiosity, feel where it lives in the body, and let it move through without a fence.", zh: "停止与那感觉搏斗。带着好奇转向它，感受它在身体何处栖居，让它在没有围栏的情况下穿身而过。" }, color: "#3dd6bd" },
  { key: "logotherapy", name: { en: "Logotherapy", zh: "意义疗法" }, stance: { en: "Find the why", zh: "寻得那个为何" }, reframe: { en: "When suffering is unavoidable, the task changes: not to escape it, but to find a meaning that can be carried through it. He who has a why can bear almost any how.", zh: "当苦难无可避免，任务便改变了：不是逃离它，而是寻得一个能贯穿它而被承载的意义。拥有「为何」的人，几乎能承受任何「如何」。" }, color: "#ff8c9e" },
];

export type Stressor = { key: string; label: Bi; firstArrow: Bi };
export const STRESSORS: Stressor[] = [
  { key: "rejection", label: { en: "Rejection", zh: "被拒绝" }, firstArrow: { en: "Someone you valued has pulled away.", zh: "一个你看重的人，疏远了你。" } },
  { key: "failure", label: { en: "Failure", zh: "失败" }, firstArrow: { en: "A project you poured yourself into did not work.", zh: "一个你倾注心力的计划，没能成功。" } },
  { key: "loss", label: { en: "Loss", zh: "失去" }, firstArrow: { en: "Something — or someone — is gone for good.", zh: "某样东西，或某个人，永远地离开了。" } },
  { key: "uncertainty", label: { en: "Uncertainty", zh: "不确定" }, firstArrow: { en: "The future you assumed has become unreadable.", zh: "你曾设定的未来，变得无法辨读。" } },
];

/* ---------- FutureFlourishing — scenario toggles ---------- */
export type FutureScenario = {
  key: string;
  name: Bi;
  desc: Bi;
  promise: Bi;
  peril: Bi;
  color: string;
  effects: Partial<Record<string, number>>; // FLOURISH_DIMS.key -> delta (-30..+30)
};
export const FUTURE_SCENARIOS: FutureScenario[] = [
  {
    key: "ai_companion",
    name: { en: "AI companions", zh: "AI 伴侣" },
    desc: { en: "Always-available listeners that never tire or judge.", zh: "随时在场、从不疲惫或评判的倾听者。" },
    promise: { en: "Comfort and being-heard for the isolated and the grieving.", zh: "为孤立者与哀伤者带来慰藉与「被听见」。" },
    peril: { en: "Frictionless intimacy can crowd out the harder, realer kind.", zh: "无摩擦的亲密，可能挤掉那更艰难、也更真实的一种。" },
    color: "#ff8c9e",
    effects: { connection: 12, stability: 10, growth: -8, integration: -6 },
  },
  {
    key: "bci",
    name: { en: "Brain–computer mood tuning", zh: "脑机情绪调谐" },
    desc: { en: "Interfaces that read and gently adjust emotional state.", zh: "能读取并温和调整情绪状态的接口。" },
    promise: { en: "Relief from depression, anxiety and chronic suffering.", zh: "从抑郁、焦虑与慢性苦难中解脱。" },
    peril: { en: "If mood is a dial, do earned and engineered joy still differ?", zh: "若情绪是个旋钮，「挣得的」与「设计的」喜悦，是否还有分别？" },
    color: "#a87fff",
    effects: { stability: 25, meaning: -12, growth: -10, freedom: -8 },
  },
  {
    key: "augment",
    name: { en: "Emotional augmentation", zh: "情绪增强" },
    desc: { en: "Pharmacology and rituals dialled to the receptor.", zh: "精确作用于受体的药物与仪式。" },
    promise: { en: "Deliberate cultivation of compassion, focus and awe.", zh: "有意识地培育慈悲、专注与敬畏。" },
    peril: { en: "Tools can deepen practice — or replace the practice entirely.", zh: "工具能深化修行——也能彻底取代修行。" },
    color: "#ffb86b",
    effects: { curiosity: 12, integration: 14, stability: 8, purpose: -6 },
  },
  {
    key: "postscarcity",
    name: { en: "Post-scarcity economy", zh: "后稀缺经济" },
    desc: { en: "Automation removes survival's old constraints.", zh: "自动化移除了生存的旧约束。" },
    promise: { en: "Freedom from drudgery; time returned to what matters.", zh: "从苦役中解放；把时间还给真正要紧之事。" },
    peril: { en: "When survival is solved, the hard problem becomes purpose itself.", zh: "当生存被解决，真正棘手的，便成了目的本身。" },
    color: "#ffd29a",
    effects: { freedom: 22, stability: 14, purpose: -16, meaning: -10 },
  },
  {
    key: "digital_mind",
    name: { en: "Digital consciousness", zh: "数字意识" },
    desc: { en: "Minds — copied, extended, or born — that may also feel.", zh: "可能同样拥有感受的心智——被复制、被延展，或被诞生。" },
    promise: { en: "Continuity, vast experience, perhaps new forms of joy.", zh: "延续、浩瀚的体验，或许还有全新形态的喜悦。" },
    peril: { en: "Whose wellbeing counts, and what would suffering mean for them?", zh: "谁的福祉被计入？而苦难，对它们又意味着什么？" },
    color: "#6ee9d4",
    effects: { curiosity: 16, growth: 10, meaning: 8, connection: -14, integration: -8 },
  },
];

/* ---------- AI layer — the Flourishing Analyst ---------- */
export type Lens = { key: string; name: Bi; role: Bi; color: string };
export const AI_LENSES: Lens[] = [
  { key: "neuro", name: { en: "Neuroscientist", zh: "神经科学家" }, role: { en: "The chemistry & circuitry beneath the feeling", zh: "感受之下的化学与回路" }, color: "#ffb86b" },
  { key: "psych", name: { en: "Psychologist", zh: "心理学家" }, role: { en: "Patterns, behaviour & what the evidence shows", zh: "模式、行为，与证据所示" }, color: "#6ee9d4" },
  { key: "philosopher", name: { en: "Philosopher", zh: "哲学家" }, role: { en: "Meaning, value & the examined life", zh: "意义、价值，与受审视的人生" }, color: "#a87fff" },
  { key: "contemplative", name: { en: "Meditation guide", zh: "冥想引导者" }, role: { en: "Direct experience, attention & rest", zh: "直接经验、注意力，与休息" }, color: "#3dd6bd" },
];

export type QA = { key: string; q: Bi; answers: Record<string, Bi> };
export const AI_QA: QA[] = [
  {
    key: "why_empty",
    q: { en: "Why do I feel empty even when things are going well?", zh: "为何一切顺遂，我却感到空虚？" },
    answers: {
      neuro: { en: "Your reward system is built around dopamine — the chemistry of pursuit. Once a goal is reached, the signal that drove you collapses; 'success' removes the very wanting that animated it. The emptiness is the dopamine system idling, waiting for the next gradient to climb.", zh: "你的奖赏系统围绕多巴胺而建——那是追逐的化学。一旦目标达成，曾驱动你的信号便坍塌；「成功」抽走了它所点燃的那份「想要」。空虚，正是多巴胺系统的空转，在等待下一道可攀的坡度。" },
      psych: { en: "This is the hedonic treadmill: attainment resets the baseline, and the mind re-aims at the next thing. The fix is rarely another achievement. It is meaning, connection and savouring — slower goods that do not adapt away.", zh: "这是享乐跑步机：达成重置了基线，心智随即瞄准下一个。解法极少是又一项成就，而是意义、连接与回味——那些不会被适应所抹去的、更慢的善。" },
      philosopher: { en: "You may have optimised for goals that were never truly yours — borrowed scripts of success. Emptiness can be an honest signal: a life can be going well by external metrics and badly by the only ones that count. Ask what you would do if no one were watching.", zh: "你或许一直在为从不真正属于你的目标而优化——借来的成功剧本。空虚，可能是一个诚实的信号：一种人生，可以按外部指标走得很好，却按唯一要紧的指标走得很糟。问问自己：若无人在看，你会做什么。" },
      contemplative: { en: "Don't rush to fill it. Sit with the emptiness without naming it a problem. Often what we call emptiness is simply spaciousness we were taught to fear. Breathe into it, and notice it is not, in fact, painful — only unfamiliar.", zh: "别急着填满它。与空虚同坐，不将它命名为问题。我们所谓的空虚，往往只是被教导去惧怕的「空间」。把呼吸带入其中，你会发觉它其实并不痛苦——只是陌生。" },
    },
  },
  {
    key: "more_money",
    q: { en: "Will more money make me happier?", zh: "更多的钱会让我更幸福吗?" },
    answers: {
      neuro: { en: "Money buys relief from stressors, which lowers chronic cortisol — a real effect. But it cannot keep raising dopamine; the brain recalibrates to each new level within months, so the next raise feels like the last.", zh: "金钱能买来对压力源的缓解，从而降低慢性皮质醇——这是实在的效应。但它无法持续抬高多巴胺；大脑在数月内便对每个新水平重新校准，于是下一次加薪，感觉如同上一次。" },
      psych: { en: "Up to a moderate income that covers security, money and happiness rise together. Past that, the curve flattens hard — what predicts wellbeing becomes how you spend it: on time, experiences and others, not status goods.", zh: "在覆盖安全感的中等收入之前，金钱与幸福一同上升。越过之后，曲线急剧变平——此时预测幸福的，是你如何花钱：花在时间、体验与他人身上，而非地位性消费。" },
      philosopher: { en: "Epicurus already saw it: the absence of want is the pleasure, so the cheaper path is to desire less rather than acquire more. Wealth is a tool; mistaking the tool for the goal is the oldest error in the study of the good life.", zh: "伊壁鸠鲁早已看清：匮乏的缺席，本身即是快乐；故而更廉价的路，是欲求更少，而非获取更多。财富是工具；将工具误认作目标，是「美好生活」之学里最古老的错误。" },
      contemplative: { en: "Notice the felt sense of 'not enough.' It rarely lives in your bank balance — it lives in the body, as a subtle contraction. No sum dissolves it from outside. Enough is a state you practise, not a number you reach.", zh: "留意那「不够」的切身之感。它极少住在你的存款里——它住在身体中，是一种细微的收紧。没有任何数目能从外部消解它。「够了」是一种你去练习的状态，而非一个你抵达的数字。" },
    },
  },
  {
    key: "lonely",
    q: { en: "I'm surrounded by people but feel alone. Why?", zh: "我身边围满了人，却感到孤独，为何?" },
    answers: {
      neuro: { en: "Oxytocin responds to depth, not headcount — to being truly seen, touched, trusted. A crowd of low-trust contact can leave the bonding system unfed, registering as loneliness even amid noise.", zh: "催产素回应的是深度，而非人数——是被真正看见、被触碰、被信任。一群低信任的接触，可能让联结系统得不到喂养，即便置身喧闹，也被登记为孤独。" },
      psych: { en: "Loneliness measures the gap between the connection you have and the connection you need, not how many people are nearby. One conversation where you feel known outweighs a hundred where you perform.", zh: "孤独度量的，是你「拥有的连接」与「所需的连接」之间的落差，而非身边有多少人。一场让你感到被懂得的交谈，胜过一百场你在其中表演的交谈。" },
      philosopher: { en: "Modern life optimises for many weak ties and few strong ones — efficient for networking, starving for belonging. To be known requires the slow, inefficient, vulnerable thing the age is built to avoid.", zh: "现代生活为「许多弱连接、少数强连接」而优化——对人脉高效，对归属却饥饿。被懂得，需要那件缓慢、低效而脆弱之事——恰是这个时代被建造来回避的东西。" },
      contemplative: { en: "Before reaching outward, sit with yourself as you would a friend. Loneliness often softens not when we find company but when we stop abandoning our own company. Be the steady presence you are seeking.", zh: "在向外伸手之前，像对待一位朋友那样，与自己同坐。孤独的软化，往往不在于我们找到了陪伴，而在于我们不再抛弃自己的陪伴。成为你正在寻找的那个稳定的在场。" },
    },
  },
  {
    key: "meaning",
    q: { en: "How do I find meaning, not just pleasure?", zh: "我该如何找到意义，而不只是快乐?" },
    answers: {
      neuro: { en: "Pleasure and meaning run on different circuits. Pleasure is acute and adapts; meaning recruits memory, narrative and the medial prefrontal cortex — slower systems that compound rather than habituate. You can feel this: meaning often feels less like a spike and more like depth.", zh: "快乐与意义跑在不同的回路上。快乐是急性的、会适应；意义则调用记忆、叙事与内侧前额叶——那些会复利累积、而非习惯化的更慢系统。你能感觉到这一点：意义往往不像尖峰，而更像深度。" },
      psych: { en: "Meaning has three reliable ingredients: coherence (life makes sense), purpose (goals worth pursuing) and mattering (you count to someone). Strengthen any one and the others tend to follow. Contribution to others is the most robust source we have measured.", zh: "意义有三种可靠的成分：连贯（人生说得通）、目的（值得追求的目标）与「被在意」（你对某人很重要）。强化其一，其余往往随之而来。对他人的贡献，是我们所测得的最稳健的来源。" },
      philosopher: { en: "Meaning is not found by looking inward for a hidden passion; it is built by answering what life asks of you. Frankl inverted the question: don't ask what you want from life, ask what it is asking of you, here, now, with these specific people.", zh: "意义并非靠向内搜寻一份隐藏的热情而「找到」；它是靠回应「生活向你提出的要求」而「建成」。弗兰克尔把问题倒转：别问你想从生活中得到什么，要问它正向你要求什么——在此处，此刻，与这些具体的人之间。" },
      contemplative: { en: "Meaning often hides in attention, not in grand projects. Wash one dish completely. Listen to one person fully. The sense of meaninglessness is frequently the sense of being absent from your own life — presence is its quiet antidote.", zh: "意义常藏于注意力，而非宏大的工程。完整地洗好一只碗。全然地听一个人说话。无意义之感，往往是「缺席于自己人生」之感——而临在，是它安静的解药。" },
    },
  },
  {
    key: "anxiety",
    q: { en: "How do I work with anxiety instead of fighting it?", zh: "我该如何与焦虑共处，而非与之搏斗?" },
    answers: {
      neuro: { en: "Anxiety is your threat system mobilising — cortisol and adrenaline preparing the body for a danger your cortex can't locate. Slow exhalation directly engages the vagus nerve and tells the brainstem the emergency is over; physiology can lead the mind back to calm.", zh: "焦虑，是你的威胁系统在动员——皮质醇与肾上腺素，正为一个你的皮层无法定位的危险而备战。缓慢的呼气，会直接激活迷走神经，告诉脑干「警报解除」；生理，能引领心智回到平静。" },
      psych: { en: "Avoidance teaches the brain the threat was real, so anxiety grows. Approaching it in tolerable doses — and letting the feeling crest and fall without escape — is how the alarm recalibrates. The way out is, reliably, through.", zh: "回避会教会大脑「威胁是真的」，于是焦虑壮大。以可承受的剂量趋近它——让那感觉涨起、又落下，而不逃离——警报便由此重新校准。出路，可靠地，是穿越。" },
      philosopher: { en: "Much anxiety is the future colonising the present — suffering in advance over what may never come. The Stoics trained for this: separate what is up to you from what is not, prepare the response that is yours, and let the rest be.", zh: "许多焦虑，是未来对当下的殖民——为或许永不到来之事，预先受苦。斯多葛为此而训练：把「取决于你的」与「不取决于你的」分开，备好那份属你的回应，余者，随它去。" },
      contemplative: { en: "Stop trying to make it leave; that is a second layer of resistance. Locate it in the body — chest, throat, gut — and breathe around the edges of the sensation. Anxiety hated is anxiety fed; anxiety met with gentleness loses its grip.", zh: "别再试图赶它走；那不过是第二层抗拒。在身体里定位它——胸口、喉咙、腹中——绕着那感觉的边缘呼吸。被憎恶的焦虑，是被喂养的焦虑；被温柔以待的焦虑，会松开它的掌控。" },
    },
  },
];
