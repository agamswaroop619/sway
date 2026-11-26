
import { firestore } from '@/app/firebase.config';
import { Item } from '@/lib/features/items/items';
import { collection, getDocs } from 'firebase/firestore';
import { Timestamp } from "firebase/firestore";
import { data as fallbackProducts } from '@/app/data';

const normalizeProduct = (product: Record<string, unknown>): Item => {
  const quantity = Array.isArray(product.quantity)
    ? product.quantity
    : [Number(product.quantity) || 0];

  const category = Array.isArray(product.category)
    ? product.category
    : [product.category || 'Uncategorized'];

  const createdAtValue = product.createdAt;

  const isTimestampLike = (v: unknown): v is { toMillis: () => number } =>
    typeof v === 'object' && v !== null && typeof (v as Record<string, unknown>)['toMillis'] === 'function';

  const createdAt =
    createdAtValue instanceof Timestamp
      ? createdAtValue.toMillis()
      : isTimestampLike(createdAtValue)
      ? createdAtValue.toMillis()
      : typeof createdAtValue === 'number'
      ? createdAtValue
      : Date.now();

  return {
    ...product,
    id: String(product.id ?? ''),
    docId: product.docId ?? String(product.id ?? ''),
    collection: product.collection || product.category || 'Uncategorized',
    title: product.title || 'Untitled product',
    images: Array.isArray(product.images) ? product.images : [],
    price: Number(product.price) || 0,
    description: product.description || '',
    descImg: product.descImg || '',
    color: product.color || '',
    review: Number(product.review) || 0,
    category,
    quantity,
    createdAt,
  } as Item;
};

export async function getData(): Promise<Item[] | null> {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'products'));
    const res = querySnapshot.docs.map((doc) => normalizeProduct({
      docId: doc.id,
      id: doc.id,
      ...doc.data(),
    }));

    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
  } catch (error) {
    console.error('Failed to fetch products from Firestore, using fallback data.', error);
  }

  return fallbackProducts.map((product: Record<string, unknown>) => normalizeProduct(product));
}