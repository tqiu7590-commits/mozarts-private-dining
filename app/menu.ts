export const appetites = ["Forgiveness", "Desire", "Recognition", "Love", "Nothing"] as const;
export type Appetite = (typeof appetites)[number];

export const courses = [
  {
    id: "aperitif",
    file: "01-aperitif.txt",
    number: "01",
    name: "Apéritif",
    ingredients: [
      "Basse-Autriche — Fleurs de tilleul",
      "Wachau — Miel",
      "Ceylan — Cannelle",
    ],
    ingredientsZh: "下奥地利椴树花 & 瓦豪蜂蜜 & 锡兰肉桂",
    description: "Une infusion douce et réconfortante, où le miel s’accorde à la chaleur délicate de la cannelle. Les fleurs de tilleul apportent une note florale légère et apaisante, pour une pause simple, chaleureuse et sereine.",
  },
  {
    id: "entree",
    file: "02-entree.txt",
    number: "02",
    name: "Entrée",
    ingredients: [
      "Périgord — Foie gras",
      "Alsace — Pâte feuilletée",
      "Bourgogne — Groseilles rouges",
    ],
    ingredientsZh: "佩里戈尔鹅肝 & 阿尔萨斯酥皮 & 勃艮第红醋栗",
    description: "Un foie gras délicatement enveloppé dans une pâte feuilletée dorée, accompagné d’une confiture de groseilles rouges aux notes fraîches et acidulées. La richesse du foie gras se trouve ainsi équilibrée par la vivacité du fruit, dans un accord délicat et généreux.",
  },
  {
    id: "plat-principal",
    file: "03-plat-principal.txt",
    number: "03",
    name: "Plat Principal",
    ingredients: [
      "Basse-Autriche — Veau",
      "Styrie — Champignons",
      "Légumes-racines, herbes fraîches & crème",
    ],
    ingredientsZh: "下奥地利小牛肉 & 施蒂里亚蘑菇 & 根茎蔬菜 & 香草奶油",
    description: "Un tendre veau mijoté dans une crème délicatement parfumée aux herbes fraîches, accompagné de champignons des sous-bois et de légumes-racines. Une préparation douce et généreuse, où la richesse de la crème s’accorde à la fraîcheur des herbes et aux saveurs profondes de la terre.",
  },
  {
    id: "fromage",
    file: "04-fromage.txt",
    number: "04",
    name: "Fromage",
    ingredients: [
      "Île-de-France — Brie",
      "Pain de campagne",
      "Raisins & noix",
    ],
    ingredientsZh: "法兰西岛布里奶酪 & 乡村面包 & 葡萄 & 核桃",
    description: "Un Brie doux et crémeux accompagné de pain de campagne, de raisins frais et de quelques noix. La douceur du fromage se mêle à la fraîcheur du fruit et au croquant délicat des noix, offrant une transition simple et élégante vers le dessert.",
  },
  {
    id: "dessert",
    file: "05-dessert.txt",
    number: "05",
    name: "Dessert",
    ingredients: [
      "Veneto — Yuzu & citron vert",
      "Cardamome verte & menthe",
    ],
    ingredientsZh: "威尼托柚子 & 青柠 & 绿豆蔻 & 薄荷",
    description: "Le yuzu éclatant rencontre la fraîcheur de la menthe et la chaleur délicatement épicée de la cardamome verte. Le citron vert apporte une pointe d’acidité, tandis que la douceur lactée et le sorbet prolongent les arômes dans une finale fraîche et légère.",
  },
  {
    id: "digestif",
    file: "06-digestif.txt",
    number: "06",
    name: "Digestif",
    ingredients: ["Trapani — Marsala Dolce"],
    ingredientsZh: "特拉帕尼马沙拉甜酒",
    description: "Un vin doux et généreux, aux notes de fruits secs, de caramel et d’épices délicates. Servi en fin de repas, il prolonge les dernières saveurs avec une chaleur douce et persistante.",
  },
] as const;

export type CourseId = (typeof courses)[number]["id"];
