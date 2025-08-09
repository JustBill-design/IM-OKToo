import os
import pandas as pd
from bert_score import score
import logging
import requests
from sentence_transformers import SentenceTransformer, util
import json
import sys


# Suppress HF warnings
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logging.getLogger("transformers").setLevel(logging.ERROR)

# ==== EVALUATION ====
sbert_model = SentenceTransformer('all-MiniLM-L6-v2') 

def evaluate_chatbot_responses(test_cases):
    """
    Calls Claude for each test case, evaluates against reference answers using BERTScore.
    """
    candidates = []
    references = []

    for case in test_cases:
        case['chatbot_response'] = case['chatbot_response'].strip()
        candidates.append(case['chatbot_response'])
        references.append(case['reference_answer'])

    # Compute BERTScore
    P, R, F1 = score(candidates, references, model_type='roberta-large', lang='en', rescale_with_baseline=True, idf=True)

    # Compute SBERT cosine similarity for each pair
    sbert_scores = []
    for cand, ref in zip(candidates, references):
        emb_cand = sbert_model.encode(cand, convert_to_tensor=True)
        emb_ref = sbert_model.encode(ref, convert_to_tensor=True)
        sim = util.cos_sim(emb_cand, emb_ref).item()
        sbert_scores.append(sim)

    results = []
    for i, case in enumerate(test_cases):
        results.append({
            'Category': case['category'],
            'Prompt': case['prompt'],
            'Reference Answer': case['reference_answer'],
            'Chatbot Response': case['chatbot_response'],
            'Precision': P[i].item(),
            'Recall': R[i].item(),
            'F1 Score': F1[i].item(),
            'SBERT Similarity': sbert_scores[i]
        })

    return pd.DataFrame(results)


if __name__ == "__main__":
    input_json = sys.stdin.read()
    test_cases = json.loads(input_json)

    df_results = evaluate_chatbot_responses(test_cases)

    # Round scores for cleaner output
    df_results['Precision'] = df_results['Precision'].round(3)
    df_results['Recall'] = df_results['Recall'].round(3)
    df_results['F1 Score'] = df_results['F1 Score'].round(3)
    df_results['SBERT Similarity'] = df_results['SBERT Similarity'].round(3)

    # Calculate averages
    avg_f1 = df_results['F1 Score'].mean()
    avg_sbert = df_results['SBERT Similarity'].mean()

    output = {
        "average_f1": avg_f1,
        "average_sbert": avg_sbert,
        "results": df_results.to_dict(orient='records')
    }

    #JSON output 
    print(json.dumps(output))