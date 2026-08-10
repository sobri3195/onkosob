import type { MedicalReference } from '@/types/content'

export const references = {
  nciBiopsy: { id:'nci-biopsy', title:'Biopsy', authors:'National Cancer Institute', url:'https://www.cancer.gov/publications/dictionaries/cancer-terms/def/biopsy', sourceType:'government' },
  nciPathology: { id:'nci-pathology', title:'Surgical Pathology Reports', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/diagnosis-staging/diagnosis/pathology-reports-fact-sheet', sourceType:'government' },
  nciStage: { id:'nci-stage', title:'Cancer Staging', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/diagnosis-staging/staging', sourceType:'government' },
  nciChemo: { id:'nci-chemo', title:'Chemotherapy to Treat Cancer', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/treatment/types/chemotherapy', sourceType:'government' },
  nciRadiation: { id:'nci-radiation', title:'Radiation Therapy to Treat Cancer', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/treatment/types/radiation-therapy', sourceType:'government' },
  nciInfection: { id:'nci-infection', title:'Infection and Neutropenia during Cancer Treatment', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/treatment/side-effects/infection', sourceType:'government' },
  nciNutrition: { id:'nci-nutrition', title:'Nutrition in Cancer Care (PDQ®)–Patient Version', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/treatment/side-effects/appetite-loss/nutrition-pdq', sourceType:'government' },
  whoPalliative: { id:'who-palliative', title:'Palliative care', authors:'World Health Organization', url:'https://www.who.int/news-room/fact-sheets/detail/palliative-care', sourceType:'organization' },
  nciCaregiver: { id:'nci-caregiver', title:'Support for Cancer Caregivers', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/coping/caregiver-support', sourceType:'government' },
  nciSurvivorship: { id:'nci-survivorship', title:'Survivorship', authors:'National Cancer Institute', url:'https://www.cancer.gov/about-cancer/coping/survivorship', sourceType:'government' },
} satisfies Record<string, MedicalReference>
