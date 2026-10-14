import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, relatedProducts, PRODUCTS } from "@/lib/products";
import { ProductDetail } from "@/components/store/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.active).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.shortDescription };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const related = relatedProducts(product);
  return <ProductDetail product={product} related={related} />;
}
