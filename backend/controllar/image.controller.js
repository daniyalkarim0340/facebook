// import { HfInference } from '@huggingface/inference';

// // Initialize the Hugging Face Instance with your token
// const hf = new HfInference(process.env.HF_TOKEN);

// export const generateImage = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: 'Prompt is required to create an image' });
//     }

//     // Call the Hugging Face serverless pipeline
//     const responseBlob = await hf.textToImage({
//       model: 'black-forest-labs/FLUX.1-schnell', 
//       inputs: prompt,
//       parameters: {
//         num_inference_steps: 4, // Flux schnell is optimized to run perfectly in 4 steps
//         width: 1024,
//         height: 1024,
//       }
//     });

//     // Extract binary data and convert to buffer
//     const arrayBuffer = await responseBlob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
    
//     // Transform buffer into a readable data URI for your React client
//     const base64Image = buffer.toString('base64');
//     const imageSrc = `data:image/jpeg;base64,${base64Image}`;

//     // Return the source string back to your ChatDashboard setup
//     return res.status(200).json({ success: true, url: imageSrc });

//   } catch (error) {
//     console.error('Hugging Face Controller Generation Failure:', error);
//     return res.status(500).json({ 
//       error: 'Failed to generate image', 
//       details: error.message 
//     });
//   }
// };