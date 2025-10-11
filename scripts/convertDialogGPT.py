import torch
from transformers import DialoGPTTokenizer, DialoGPTLMHeadModel
import onnx
from onnxruntime.tools import pytorch_export_helper

def convert_dialogpt_to_onnx():
    print("🚀 Converting DialoGPT to ONNX...")
    
    # Load the model and tokenizer
    model_name = "microsoft/DialoGPT-medium"
    tokenizer = DialoGPTTokenizer.from_pretrained(model_name)
    model = DialoGPTLMHeadModel.from_pretrained(model_name)
    
    # Set model to evaluation mode
    model.eval()
    
    # Create dummy input
    dummy_input = torch.randint(0, tokenizer.vocab_size, (1, 10))
    
    # Export to ONNX
    onnx_path = "dialogpt.onnx"
    
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input_ids'],
        output_names=['logits'],
        dynamic_axes={
            'input_ids': {0: 'batch_size', 1: 'sequence'},
            'logits': {0: 'batch_size', 1: 'sequence'}
        }
    )
    
    print(f"✅ DialoGPT converted to ONNX: {onnx_path}")
    
    # Verify the ONNX model
    onnx_model = onnx.load(onnx_path)
    onnx.checker.check_model(onnx_model)
    print("✅ ONNX model verification passed")

if __name__ == "__main__":
    convert_dialogpt_to_onnx()
