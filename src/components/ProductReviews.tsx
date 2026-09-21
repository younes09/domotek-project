import React, { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

export const ProductReviews: React.FC<{ productId: number }> = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setReviews((r) => [{ id: Date.now(), name, rating, comment }, ...r]);
    setName(""); setComment(""); setRating(5); setShowForm(false);
  };

  return (
    <div className="mt-4">
      {reviews.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>
          Aucun avis pour ce produit pour le moment. Soyez le premier à donner votre avis.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="dk-surface-2 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{r.name}</p>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" style={{ color: "var(--amber)", fill: i < r.rating ? "var(--amber)" : "none" }} />
                  ))}
                </div>
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="mt-3 text-sm dk-focus rounded" style={{ color: "var(--teal)" }}>Laisser un avis</button>
      ) : (
        <form onSubmit={submit} className="mt-3 dk-surface-2 rounded-xl p-4 space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" className="dk-input rounded-lg px-3 py-2 w-full text-sm" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button type="button" key={i} onClick={() => setRating(i + 1)}>
                <Star className="h-5 w-5" style={{ color: "var(--amber)", fill: i < rating ? "var(--amber)" : "none" }} />
              </button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Votre avis" rows={3} className="dk-input rounded-lg px-3 py-2 w-full text-sm" />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg px-4 py-2 text-sm font-semibold dk-btn-primary">Publier</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm dk-btn-secondary">Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
};
