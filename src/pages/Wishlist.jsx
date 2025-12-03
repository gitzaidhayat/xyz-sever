import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist, removeWishlistItem, addWishlistItem } from '../store/slices/wishlistSlice';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';

const WishlistPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { items, isLoading } = useSelector(state => state.wishlist);
	const { isAuthenticated } = useSelector(state => state.auth);

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'instant' });
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			dispatch(fetchWishlist());
		}
	}, [dispatch, isAuthenticated]);

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-[#f5e9da] flex items-center justify-center px-4">
				<EmptyState
					title="Login Required"
					message="Please login to view and manage your wishlist."
					action={() => navigate('/login?redirect=/wishlist')}
					actionLabel="Login"
				/>
			</div>
		);
	}

	if (isLoading) {
		return <Loader />;
	}

	if (!items || items.length === 0) {
		return (
			<div className="min-h-screen bg-[#f5e9da] py-12 px-4">
				<EmptyState
					title="Your Wishlist is Empty"
					message="Browse products and add them to your wishlist to keep track."
					action={() => navigate('/products')}
					actionLabel="Browse Products"
				/>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f5e9da] py-12 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-4xl font-bold text-[#1f2933] font-['Playfair_Display']">Wishlist</h1>
					<Button variant="secondary" onClick={() => navigate('/products')}>Continue Shopping</Button>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{items.map(prod => (
						<div key={prod._id} className="relative group">
							<ProductCard product={prod} />
							<button
								onClick={() => dispatch(removeWishlistItem(prod._id))}
								className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white text-xs px-2 py-1 rounded-md"
							>Remove</button>
							<button
								onClick={() => navigate(`/products/${prod._id}`)}
								className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#d5a437] text-white text-xs px-2 py-1 rounded-md"
							>View</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WishlistPage;

