import { getAllCategories } from "./category-mappings"

export interface Publication {
  id: string
  title: string
  category: string
  subcategory: string
  year: number
  isViewed?: boolean
  isFavorite?: boolean
  abstract?: string
  authors?: string[]
  journal?: string
  doi?: string
  osdrId?: string
  taskBookId?: string
  relatedStudies?: string[]
}

export const mockPublications: Publication[] = [
  {
    id: "1",
    title: "Mice in Bion-M 1 space mission: training and selection",
    category: "Space biology",
    subcategory: "animal study",
    year: 2014,
    isViewed: false,
    isFavorite: false,
    abstract:
      "This study examines the training and selection process for mice participating in the Bion-M 1 space mission, focusing on physiological adaptations to microgravity conditions.",
    authors: ["Smith J.", "Johnson A.", "Williams R."],
    journal: "Space Biology Research",
    doi: "10.1234/sbr.2014.001",
    osdrId: "OSDR-123",
    taskBookId: "TB-456",
    relatedStudies: ["2", "3"],
  },
  {
    id: "2",
    title:
      "Microgravity induces pelvic bone loss through osteoclastic activity, osteocytic osteolysis, and osteoblastic cell cycle inhibition by CDKN1a/p21",
    category: "Bone biology",
    subcategory: "microgravity",
    year: 2013,
    isViewed: false,
    isFavorite: false,
    abstract:
      "Investigation of bone loss mechanisms in microgravity environments, with focus on cellular processes and molecular pathways.",
    authors: ["Brown K.", "Davis M.", "Wilson T."],
    journal: "Bone Research International",
    doi: "10.1234/bri.2013.002",
    osdrId: "OSDR-124",
    relatedStudies: ["1", "4"],
  },
  {
    id: "3",
    title:
      "Dose- and Ion-Dependent Effects in the Oxidative Stress Response to Space-Like Radiation Exposure in the Skeletal System",
    category: "Radiation biology",
    subcategory: "skeletal",
    year: 2017,
    isViewed: false,
    isFavorite: false,
    abstract:
      "Analysis of radiation effects on skeletal tissue, examining dose-dependent responses and oxidative stress mechanisms.",
    authors: ["Garcia L.", "Martinez P.", "Rodriguez S."],
    journal: "Radiation Biology Quarterly",
    doi: "10.1234/rbq.2017.003",
    osdrId: "OSDR-125",
    relatedStudies: ["2", "5"],
  },
  {
    id: "4",
    title: "AtRabD2b and AtRabD2c have overlapping functions in pollen development and pollen tube growth.",
    category: "Plant biology",
    subcategory: "reproduction",
    year: 2011,
    isViewed: true,
    isFavorite: true,
    abstract:
      "Study of Arabidopsis Rab GTPases and their role in pollen development, with implications for plant reproduction in space environments.",
    authors: ["Lee H.", "Kim J.", "Park S."],
    journal: "Plant Cell Biology",
    doi: "10.1234/pcb.2011.004",
    osdrId: "OSDR-126",
    taskBookId: "TB-789",
    relatedStudies: ["6", "7"],
  },
  {
    id: "5",
    title: "TNO1 is involved in salt tolerance and vacuolar trafficking in Arabidopsis.",
    category: "Plant biology",
    subcategory: "salt tolerance",
    year: 2011,
    isViewed: false,
    isFavorite: false,
    abstract: "Investigation of TNO1 protein function in plant stress response and cellular trafficking mechanisms.",
    authors: ["Chen W.", "Liu X.", "Zhang Y."],
    journal: "Plant Stress Biology",
    doi: "10.1234/psb.2011.005",
    osdrId: "OSDR-127",
    relatedStudies: ["4", "6"],
  },
  {
    id: "6",
    title: "Functional redundancy between trans-Golgi network SNARE family members in Arabidopsis thaliana.",
    category: "Plant biology",
    subcategory: "TGN/SNARE",
    year: 2024,
    isViewed: false,
    isFavorite: false,
    abstract:
      "Analysis of SNARE protein family redundancy in plant cellular trafficking and membrane fusion processes.",
    authors: ["Anderson B.", "Thompson C.", "White D."],
    journal: "Molecular Plant Science",
    doi: "10.1234/mps.2024.006",
    osdrId: "OSDR-128",
    relatedStudies: ["4", "5"],
  },
  {
    id: "7",
    title: "Root growth movements: Waving and skewing.",
    category: "Plant biology",
    subcategory: "root movements",
    year: 2023,
    isViewed: false,
    isFavorite: false,
    abstract: "Study of plant root growth patterns and gravitropic responses in various environmental conditions.",
    authors: ["Taylor E.", "Moore F.", "Jackson G."],
    journal: "Plant Development",
    doi: "10.1234/pd.2023.007",
    osdrId: "OSDR-129",
    relatedStudies: ["4", "6"],
  },
  {
    id: "8",
    title: "Cardiovascular adaptations to long-duration spaceflight in astronauts",
    category: "Space biology",
    subcategory: "human physiology",
    year: 2022,
    isViewed: true,
    isFavorite: false,
    abstract:
      "Comprehensive analysis of cardiovascular system changes during extended missions, including heart rate variability and blood pressure regulation.",
    authors: ["Peterson R.", "Chang L.", "O'Brien M."],
    journal: "Space Medicine Journal",
    doi: "10.1234/smj.2022.008",
    osdrId: "OSDR-130",
    relatedStudies: ["1", "9"],
  },
  {
    id: "9",
    title: "Immune system dysregulation in microgravity environments",
    category: "Space biology",
    subcategory: "immunology",
    year: 2021,
    isViewed: false,
    isFavorite: false,
    abstract:
      "Investigation of immune cell function and cytokine production in astronauts during spaceflight missions.",
    authors: ["Kumar S.", "Patel N.", "Zhang Q."],
    journal: "Immunology in Space",
    doi: "10.1234/iis.2021.009",
    osdrId: "OSDR-131",
    relatedStudies: ["8", "10"],
  },
  {
    id: "10",
    title: "Radiation countermeasures for deep space exploration",
    category: "Radiation biology",
    subcategory: "protection",
    year: 2023,
    isViewed: false,
    isFavorite: false,
    abstract:
      "Evaluation of pharmaceutical and physical shielding approaches to mitigate radiation exposure during Mars missions.",
    authors: ["Yamamoto K.", "Schmidt H.", "Dubois F."],
    journal: "Radiation Protection Research",
    doi: "10.1234/rpr.2023.010",
    osdrId: "OSDR-132",
    taskBookId: "TB-890",
    relatedStudies: ["3", "9"],
  },
]

export const filterCategories = getAllCategories()
  .slice(0, 6)
  .map((cat) => ({
    id: cat.id,
    label: cat.label,
    icon: cat.mapping.icon,
    color: cat.mapping.color,
  }))
