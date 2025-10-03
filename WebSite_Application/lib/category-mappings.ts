import {
  type LucideIcon,
  Dna,
  Bone,
  Radiation,
  Leaf,
  Activity,
  User,
  Globe,
  Shield,
  Droplet,
  Microscope,
  ShieldX as Helix,
  Heart,
  Brain,
  Dumbbell,
  Apple,
  Users,
  Atom,
  Beaker,
  FlaskConical,
} from "lucide-react"

export interface CategoryMapping {
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
  description: string
}

export const categoryMappings: Record<string, CategoryMapping> = {
  "space biology": {
    icon: Dna,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    description: "Research on biological systems in space environments",
  },
  "bone biology": {
    icon: Bone,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/30",
    description: "Studies on bone density and skeletal health in microgravity",
  },
  "radiation biology": {
    icon: Radiation,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    description: "Effects of cosmic radiation on biological systems",
  },
  "plant biology": {
    icon: Leaf,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    description: "Plant growth and development in space conditions",
  },
  mechanobiology: {
    icon: Activity,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    description: "Mechanical forces and their effects on biological systems",
  },
  "human health": {
    icon: User,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    description: "Human physiological adaptations to spaceflight",
  },
  "mars research": {
    icon: Globe,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    description: "Research related to Mars exploration and habitability",
  },
  "covid-19": {
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    description: "COVID-19 related research in space contexts",
  },
  microgravity: {
    icon: Droplet,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/30",
    description: "Effects of reduced gravity on various systems",
  },
  "cell biology": {
    icon: Microscope,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    description: "Cellular processes and functions in space",
  },
  genetics: {
    icon: Helix,
    color: "text-pink-400",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/30",
    description: "Genetic changes and expression in space environments",
  },
  immunology: {
    icon: Shield,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/20",
    borderColor: "border-indigo-500/30",
    description: "Immune system function during spaceflight",
  },
  neuroscience: {
    icon: Brain,
    color: "text-violet-400",
    bgColor: "bg-violet-500/20",
    borderColor: "border-violet-500/30",
    description: "Neural and cognitive effects of space travel",
  },
  cardiovascular: {
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/20",
    borderColor: "border-rose-500/30",
    description: "Heart and circulatory system in microgravity",
  },
  "muscle biology": {
    icon: Dumbbell,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/30",
    description: "Muscle atrophy and adaptation in space",
  },
  nutrition: {
    icon: Apple,
    color: "text-lime-400",
    bgColor: "bg-lime-500/20",
    borderColor: "border-lime-500/30",
    description: "Nutritional requirements for space missions",
  },
  psychology: {
    icon: Users,
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/30",
    description: "Psychological effects of long-duration spaceflight",
  },
  astrobiology: {
    icon: Atom,
    color: "text-sky-400",
    bgColor: "bg-sky-500/20",
    borderColor: "border-sky-500/30",
    description: "Study of life in the universe",
  },
  exobiology: {
    icon: Beaker,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    borderColor: "border-emerald-500/30",
    description: "Life beyond Earth and extraterrestrial biology",
  },
  "synthetic biology": {
    icon: FlaskConical,
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500/20",
    borderColor: "border-fuchsia-500/30",
    description: "Engineered biological systems for space applications",
  },
}

// Helper function to get category mapping with fallback
export function getCategoryMapping(category?: string): CategoryMapping {
  const normalizedCategory = (category || "").toLowerCase()
  return (
    categoryMappings[normalizedCategory] || {
      icon: Microscope,
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
      borderColor: "border-gray-500/30",
      description: "Research category",
    }
  )
}

// Get all unique categories for filters
export function getAllCategories(): Array<{ id: string; label: string; mapping: CategoryMapping }> {
  return Object.entries(categoryMappings).map(([key, mapping]) => ({
    id: key.replace(/\s+/g, "-"),
    label: key.charAt(0).toUpperCase() + key.slice(1),
    mapping,
  }))
}
