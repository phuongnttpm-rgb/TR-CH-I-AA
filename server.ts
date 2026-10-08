import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { INITIAL_QUESTIONS } from './src/data/chemQuestions';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Preset question banks for other textbook chapters
const PRESET_CHAPTERS: Record<string, any[]> = {
  amino_acid: INITIAL_QUESTIONS,
  ester_lipid: [
    {
      id: 201, level: 1, difficultyLabel: 'Nhận biết',
      question: 'Theo SGK Hóa học 12 (KNTT, Bài 1), khi thay thế nhóm -OH ở nhóm carboxyl (-COOH) của carboxylic acid bằng nhóm -OR\' thì thu được hợp chất gì?',
      options: { A: 'Ester', B: 'Alcohol', C: 'Amine', D: 'Ether' },
      correctAnswer: 'A',
      explanation: 'SGK Hóa 12 KNTT (trang 7): Khi thay thế nhóm -OH ở nhóm carboxyl (-COOH) của carboxylic acid bằng nhóm -OR\' thì được ester.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 7',
      diagramType: 'general_structure'
    },
    {
      id: 202, level: 2, difficultyLabel: 'Nhận biết',
      question: 'Ester HCOOCH₃ có tên gọi là gì theo danh pháp gốc - chức?',
      options: { A: 'Methyl formate', B: 'Ethyl formate', C: 'Methyl acetate', D: 'Ethyl acetate' },
      correctAnswer: 'A',
      explanation: 'SGK Hóa 12 KNTT (trang 7): HCOOCH3 gồm gốc alcohol là methyl và gốc carboxylate formate -> methyl formate.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 7'
    },
    {
      id: 203, level: 3, difficultyLabel: 'Nhận biết',
      question: 'Chất béo là triester của carboxylic acid đơn chức (acid béo) với alcohol nào sau đây?',
      options: { A: 'Methanol', B: 'Ethanol', C: 'Glycerol', D: 'Ethylene glycol' },
      correctAnswer: 'C',
      explanation: 'SGK Hóa 12 KNTT (trang 10): "Chất béo là triester của glycerol với acid béo, gọi chung là triglyceride."',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 10'
    },
    {
      id: 204, level: 4, difficultyLabel: 'Thông hiểu',
      question: 'So với alcohol và carboxylic acid có cùng phân tử khối tương đương, các phân tử ester có nhiệt độ sôi thế nào?',
      options: { A: 'Cao hơn rất nhiều', B: 'Thấp hơn nhiều do không tạo được liên kết hydrogen liên phân tử', C: 'Tương đương nhau', D: 'Không xác định được' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 7): Các phân tử ester không tạo được liên kết hydrogen với nhau nên có nhiệt độ sôi thấp hơn nhiều so với alcohol và carboxylic acid.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 7'
    },
    {
      id: 205, level: 5, difficultyLabel: 'Thông hiểu',
      question: 'Phản ứng thủy phân ester trong môi trường base (như NaOH, KOH) đun nóng được gọi là phản ứng gì?',
      options: { A: 'Phản ứng ester hóa', B: 'Phản ứng xà phòng hoá', C: 'Phản ứng hydrogen hóa', D: 'Phản ứng trùng ngưng' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 8): Phản ứng thủy phân ester trong môi trường base được ứng dụng làm xà phòng nên được gọi là phản ứng xà phòng hoá.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 8'
    },
    {
      id: 206, level: 6, difficultyLabel: 'Thông hiểu',
      question: 'Acid béo no nào sau đây có công thức phân tử là CH₃[CH₂]₁₄COOH?',
      options: { A: 'Stearic acid', B: 'Palmitic acid', C: 'Oleic acid', D: 'Linoleic acid' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 10): Palmitic acid có công thức CH3[CH2]14COOH (C15H31COOH). Stearic acid là CH3[CH2]16COOH.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 10'
    },
    {
      id: 207, level: 7, difficultyLabel: 'Thông hiểu',
      question: 'Ở nhiệt độ phòng, chất béo chứa nhiều gốc acid béo không no thường ở trạng thái nào?',
      options: { A: 'Trạng thái rắn', B: 'Trạng thái lỏng (như dầu lạc, dầu vừng, dầu cá)', C: 'Trạng thái khí', D: 'Trạng thái keo đặc' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 11): Khi trong phân tử chất béo chứa nhiều gốc acid béo không no thì chúng thường ở trạng thái lỏng như dầu thực vật, dầu cá.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 11'
    },
    {
      id: 208, level: 8, difficultyLabel: 'Thông hiểu',
      question: 'Phản ứng hydrogen hoá chất béo lỏng (dầu thực vật) thành chất béo rắn (bơ nhân tạo) nhằm mục đích gì?',
      options: { A: 'Chuyển gốc acid béo không no thành gốc acid béo no', B: 'Tách lấy glycerol tự do', C: 'Tạo bọt xà phòng', D: 'Phân hủy hoàn toàn phân tử' },
      correctAnswer: 'A',
      explanation: 'SGK Hóa 12 KNTT (trang 11): Các chất béo có gốc acid không no có thể phản ứng với hydrogen (t°, p, xt) để chuyển thành chất béo chứa gốc acid no (bơ thực vật).',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 11'
    },
    {
      id: 209, level: 9, difficultyLabel: 'Vận dụng',
      question: 'Acid béo omega-3 và omega-6 có đặc điểm cấu tạo nào sau đây?',
      options: { A: 'Là các acid béo no có 3 hoặc 6 liên kết ba', B: 'Là các acid béo không no với liên kết đôi đầu tiên ở vị trí số 3 và 6 khi đánh số từ nhóm methyl', C: 'Là các acid có 3 nhóm -COOH', D: 'Là các alcohol đa chức' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 12): Acid béo omega-3 và omega-6 là các acid béo không no với liên kết đôi đầu tiên ở vị trí số 3 và 6 khi đánh số từ nhóm methyl.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 12'
    },
    {
      id: 210, level: 10, difficultyLabel: 'Vận dụng',
      question: 'Ester isoamyl acetate có mùi thơm đặc trưng của quả gì?',
      options: { A: 'Mùi dứa chín', B: 'Mùi hoa nhài', C: 'Mùi chuối chín (dầu chuối)', D: 'Mùi táo xanh' },
      correctAnswer: 'C',
      explanation: 'SGK Hóa 12 KNTT (trang 9): Isoamyl acetate có mùi thơm đặc trưng của chuối chín nên còn được gọi là dầu chuối.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 9'
    },
    {
      id: 211, level: 11, difficultyLabel: 'Vận dụng',
      question: 'Khi đun nóng tripalmitin với dung dịch NaOH vừa đủ, sản phẩm thu được gồm:',
      options: { A: 'Glycerol và sodium stearate', B: 'Glycerol và sodium palmitate (C₁₅H₃₁COONa)', C: 'Ethylene glycol và sodium palmitate', D: 'Glycerol và sodium oleate' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 16): Thủy phân tripalmitin (C15H31COO)3C3H5 trong dung dịch NaOH tạo glycerol và sodium palmitate C15H31COONa.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1 & 2, Trang 16'
    },
    {
      id: 212, level: 12, difficultyLabel: 'Vận dụng',
      question: 'Hiện tượng dầu mỡ bị ôi thiu khi để lâu ngoài không khí chủ yếu là do:',
      options: { A: 'Các liên kết đôi ở gốc acid béo không no bị oxi hoá chậm bởi oxygen không khí', B: 'Chất béo bị bay hơi', C: 'Glycerol phản ứng với hơi nước', D: 'Chất béo tự trùng ngưng' },
      correctAnswer: 'A',
      explanation: 'SGK Hóa 12 KNTT (trang 11): Khi để lâu trong không khí, các gốc acid béo không no trong chất béo có thể bị oxi hoá chậm bởi oxygen, tạo thành các hợp chất có mùi khó chịu (hiện tượng dầu mỡ bị ôi).',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 11'
    },
    {
      id: 213, level: 13, difficultyLabel: 'Vận dụng',
      question: 'Hợp chất aspirin dùng làm thuốc giảm đau, hạ sốt có nguồn gốc từ dẫn xuất ester của chất nào?',
      options: { A: 'Benzoic acid', B: 'Salicylic acid', C: 'Acetic acid đơn thuần', D: 'Phenol đơn thuần' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 9, Em có biết): Aspirin sau khi uống bị thuỷ phân trong cơ thể tạo thành salicylic acid, có tác dụng ức chế tổng hợp prostaglandin.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 9'
    },
    {
      id: 214, level: 14, difficultyLabel: 'Vận dụng',
      question: 'Phản ứng ester hoá giữa acetic acid và ethanol là phản ứng:',
      options: { A: 'Một chiều hoàn toàn', B: 'Thuận nghịch, có xúc tác H₂SO₄ đặc và đun nóng', C: 'Toả nhiệt mãnh liệt gây nổ', D: 'Quang hoá' },
      correctAnswer: 'B',
      explanation: 'SGK Hóa 12 KNTT (trang 8-9): Phản ứng ester hoá là phản ứng thuận nghịch, xúc tác H2SO4 đặc và đun nóng.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 8 - 9'
    },
    {
      id: 215, level: 15, difficultyLabel: 'Vận dụng cao',
      question: 'Cho các phát biểu sau: (1) Chất béo nhẹ hơn nước và không tan trong nước; (2) Phản ứng thuỷ phân ester trong môi trường acid là thuận nghịch; (3) Hydrogen hoá chất béo lỏng giúp bảo quản lâu hơn; (4) Triolein có phản ứng cộng Br₂. Số phát biểu đúng là:',
      options: { A: '1', B: '2', C: '3', D: '4' },
      correctAnswer: 'D',
      explanation: 'SGK Hóa 12 KNTT (trang 8, 10, 11): Cả 4 phát biểu đều đúng theo kiến thức trọng tâm Bài 1.',
      sourceReference: 'SGK Hóa học 12 KNTT - Bài 1, Trang 6 - 13'
    }
  ]
};

// POST /api/ai-hint: Smart lifeline hint based on textbook
app.post('/api/ai-hint', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Thiếu dữ liệu câu hỏi' });
      return;
    }

    if (ai) {
      const prompt = `Bạn là cố vấn chuyên gia Hóa học 12 trong gameshow truyền hình "Đấu Trường Hóa Học 12".
Người chơi đang xin quyền trợ giúp AI GỢI Ý cho câu hỏi sau:
Câu hỏi: "${question.question}"
Lựa chọn:
A. ${question.options.A}
B. ${question.options.B}
C. ${question.options.C}
D. ${question.options.D}
Đáp án đúng là: ${question.correctAnswer} (${question.options[question.correctAnswer]})
Cơ sở SGK: "${question.explanation}"
Nguồn: "${question.sourceReference}"

YÊU CẦU QUAN TRỌNG:
1. Bạn KHÔNG được nói thẳng ra là chọn A, B, C hay D.
2. Hãy đưa ra lời khuyên gợi ý tư duy sâu sắc, nhắc lại mấu chốt kiến thức trong SGK Hóa học 12 (ví dụ: chú ý đến liên kết peptide, số nhóm -NH2/-COOH, môi trường pH, ion lưỡng cực...) để người chơi tự suy luận ra đáp án đúng.
3. Độ dài ngắn gọn: 2 - 3 câu, phong cách trường quay truyền hình hồi hộp, hữu ích.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      res.json({ hint: response.text });
      return;
    }

    // Offline fallback hint based on question data
    const fallbackHint = `Hãy nhớ lại bài học trong ${question.sourceReference}. Gợi ý mấu chốt: chú ý vào nhóm chức đặc trưng, số lượng liên kết và bản chất phân tử được nhắc đến trong sách!`;
    res.json({ hint: fallbackHint });
  } catch (error) {
    console.error('Error generating AI hint:', error);
    const fallback = req.body.question?.explanation 
      ? `Gợi ý từ SGK: Hãy lưu ý tính chất đặc thù của các chất được nêu trong ${req.body.question.sourceReference}.`
      : 'Hãy suy nghĩ kỹ dựa trên lý thuyết Bài 9 trong sách giáo khoa!';
    res.json({ hint: fallback });
  }
});

// POST /api/generate-game: Generate 15 graded questions from preset or custom text
app.post('/api/generate-game', async (req: Request, res: Response): Promise<void> => {
  try {
    const { mode, presetId, sourceText, sourceTitle } = req.body;

    if (mode === 'preset') {
      const presetData = PRESET_CHAPTERS[presetId] || PRESET_CHAPTERS.amino_acid;
      res.json({ questions: presetData });
      return;
    }

    // Custom Mode
    if (!sourceText || sourceText.trim().length < 100) {
      res.status(400).json({
        error: 'Nguồn tài liệu quá ngắn (cần tối thiểu 100 ký tự). Vui lòng cung cấp thêm dữ liệu từ tài liệu hoặc YouTube transcript!',
      });
      return;
    }

    if (!ai) {
      res.status(500).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên hệ thống để sinh câu hỏi từ tài liệu ngoài. Vui lòng sử dụng các bộ chuyên đề SGK có sẵn.',
      });
      return;
    }

    const systemPrompt = `Bạn là chuyên gia khảo thí Hóa học 12.
Nhiệm vụ: Dựa CHÍNH XÁC và DUY NHẤT vào nội dung tài liệu người dùng cung cấp dưới đây để tạo ra 15 câu hỏi trắc nghiệm gameshow truyền hình (phong cách Ai Là Triệu Phú).

QUY TẮC BẮT BUỘC:
1. ĐÚNG NGUỒN: Mọi câu hỏi, đáp án, và lời giải thích PHẢI được trích xuất hoặc suy luận trực tiếp từ nội dung nguồn được cung cấp. Tuyệt đối KHÔNG tự ý bổ sung kiến thức ngoài nguồn. Nếu nguồn không đủ dữ liệu để tạo 15 câu khác biệt, hãy tái sử dụng các khía cạnh khác nhau của cùng tài liệu nhưng đảm bảo tính chính xác tuyệt đối.
2. PHÂN HÓA 15 MỨC:
   - Câu 1 - 5: Mức Nhận biết (Dễ, hỏi định nghĩa, công thức cơ bản).
   - Câu 6 - 10: Mức Thông hiểu (Trung bình, so sánh, bản chất hiện tượng).
   - Câu 11 - 15: Mức Vận dụng & Vận dụng cao (Khó, tổng hợp, đếm phát biểu đúng sai).
3. Mỗi câu có 4 đáp án A, B, C, D, chỉ 1 đáp án đúng duy nhất.
4. Lời giải thích phải ghi rõ căn cứ vào đoạn nào trong nguồn.`;

    const prompt = `TÀI LIỆU NGUỒN:
Tiêu đề: ${sourceTitle || 'Tài liệu cung cấp'}
Nội dung:
"""
${sourceText}
"""

Hãy tạo đúng 15 câu hỏi trắc nghiệm gameshow theo cấu trúc JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + prompt }] },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              level: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ['A', 'B', 'C', 'D'],
              },
              correctAnswer: { type: Type.STRING, enum: ['A', 'B', 'C', 'D'] },
              explanation: { type: Type.STRING },
              sourceReference: { type: Type.STRING },
              difficultyLabel: { type: Type.STRING },
            },
            required: ['id', 'level', 'question', 'options', 'correctAnswer', 'explanation', 'sourceReference'],
          },
        },
      },
    });

    const jsonText = response.text?.trim() || '[]';
    const parsedQuestions = JSON.parse(jsonText);

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length < 15) {
      res.status(400).json({
        error: 'Nguồn tài liệu chưa đủ dữ liệu để tạo trọn vẹn 15 câu hỏi phân hóa. Vui lòng bổ sung thêm văn bản tài liệu!',
      });
      return;
    }

    // Format IDs and levels 1-15
    const formatted = parsedQuestions.slice(0, 15).map((q, idx) => ({
      ...q,
      id: idx + 1,
      level: idx + 1,
      difficultyLabel: idx < 5 ? 'Nhận biết' : idx < 10 ? 'Thông hiểu' : idx < 14 ? 'Vận dụng' : 'Vận dụng cao',
    }));

    res.json({ questions: formatted });
  } catch (error: any) {
    console.error('Error generating game from source:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý khi tạo câu hỏi từ tài liệu' });
  }
});

// Start Express server and mount Vite middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
