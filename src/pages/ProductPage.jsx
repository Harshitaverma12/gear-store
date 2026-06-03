import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { Gallery } from '../components/Gallery/Gallery';
import { ProductInfo } from '../components/ProductInfo/ProductInfo';
import { ProductDetails } from '../components/ProductDetails/ProductDetails';
import { ProductSkeleton } from '../components/UI/Skeleton';
import { ErrorState } from '../components/UI/ErrorState';
import styles from './ProductPage.module.scss';

export function ProductPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);

  if (loading) return <ProductSkeleton />;
  if (error)   return <ErrorState message={error} />;
  if (!product) return null;

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Shop</Link></li>
          <li><span>{product.category}</span></li>
          <li aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className={styles.pdp}>
        <div className={styles.galleryCol}>
          <Gallery images={product.images} />
        </div>
        <div className={styles.infoCol}>
          <ProductInfo product={product} />
        </div>
      </div>

      <div className={styles.details}>
        {/* Pass category so specs, description, size chart are all correct */}
        <ProductDetails description={product.description} category={product.category} />
      </div>

      <div className={styles.backWrap}>
        <Link to="/" className={styles.backLink}>← Back to all products</Link>
      </div>
    </div>
  );
}
