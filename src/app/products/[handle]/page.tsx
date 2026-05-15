import { getProductByHandle, getAllProducts, getBrand, getCondition } from "@/lib/shopify";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductDetails from "@/components/ProductDetails";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  return {
    title: `${product.title} | Mobile Connex Communications`,
    description: `Buy ${product.title} from Mobile Connex Communications. Trusted since 2007.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([
    getProductByHandle(handle),
    getAllProducts(20),
  ]);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href={getCondition(product) ? "/refurbished" : "/new-phones"}
        className="inline-flex items-center gap-1.5 text-sm text-mcx-gray hover:text-mcx-red mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <ProductDetails
        product={product}
        brand={getBrand(product)}
        condition={getCondition(product)}
        allProducts={allProducts}
      />
    </div>
  );
}
