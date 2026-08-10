export interface QuizQuestion { prompt:string; options:string[]; answer:number; explanation:string }
export interface Quiz { id:string; title:string; questions:QuizQuestion[] }
const topics=[['diagnosis','Memahami Diagnosis'],['biopsi','Mengenal Biopsi'],['staging','Dasar Staging'],['kemoterapi','Kemoterapi'],['radioterapi','Radioterapi'],['efek-samping','Efek Samping'],['paliatif','Paliatif'],['caregiver','Caregiver']]
export const quizzes:Quiz[]=topics.map(([id,title])=>({id,title,questions:[
 {prompt:`Tujuan mempelajari ${title.toLowerCase()} adalah membantu komunikasi dengan tim kesehatan.`,options:['Benar','Salah'],answer:0,explanation:'Edukasi membantu menyiapkan percakapan, bukan menggantikan penilaian klinis.'},
 {prompt:'Apakah pengalaman setiap pasien selalu sama?',options:['Ya, selalu sama','Tidak, dapat berbeda'],answer:1,explanation:'Kondisi, kebutuhan, dan rencana setiap pasien dapat berbeda.'},
 {prompt:'Siapa yang tepat menjelaskan arti hasil dalam konteks Anda?',options:['Tim kesehatan yang menangani','Mesin pencari saja','Teman tanpa konteks medis'],answer:0,explanation:'Tim yang menangani memiliki konteks klinis dan dapat menjawab pertanyaan Anda.'},
 {prompt:'Mencatat pertanyaan sebelum konsultasi dapat membantu.',options:['Benar','Salah'],answer:0,explanation:'Catatan membantu Anda mengingat topik yang ingin dibahas.'},
 {prompt:'Informasi edukasi daring dapat menetapkan diagnosis.',options:['Benar','Salah'],answer:1,explanation:'Diagnosis memerlukan penilaian tenaga kesehatan dan pemeriksaan yang sesuai.'}
]}))
