export interface Car {
	id: number;
	name: string;
	description: string;
	slug: string;
	image_path: string;
	desktop_image_path: string;
	mobile_image_path: string;
	ilm_id: string;
	taf_id: string;
	price: number;
	show: number;
	gyo_link: string;
	e_brochure_link: string;
	e_brochure_pdf_path: string | null;
	disclaimers: string;
	product_availability_id: number;
	product_category_id: number;
	product_engine_type_id: number;
	product_variant_type_id: number;
	exterior_id: number;
	interior_id: number;
	safety_id: number;
	performance_id: number;
	connected_id: number;
	accessories_id: number;
	color_option_id: number;
	exterior_360_id: number;
	interior_360_id: number;
	car_gallery_id: number;
	media_id: number;
	meta_title: string;
	meta_description: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	formatted_price: string;
	image_path_url: string;
	desktop_image_path_url: string;
	mobile_image_path_url: string;
	e_brochure_pdf_path_url: string;
}

export interface ProductAvailability {
	id: number;
	title: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface EngineType {
	id: number;
	title: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface CarVariantUsp {
	id: number;
	position: number;
	order_number: number;
	detail: string;
	car_variant_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface CarVariantProductType {
	id: number;
	position: number;
	name: string;
	price: string;
	show_in_home: number;
	car_variant_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface Media {
	id: number;
	file_name: string;
	path: string;
	type: string;
	size: string;
	created_at: string;
	updated_at: string;
}

export interface Data {
	id: number;
	name: string;
	thumbnail: string;
	car_product_id: number;
	product_engine_type_id: number;
	product_availability_id: number;
	price: number;
	media_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	formatted_price: string;
	car: Car;
	product_availability: ProductAvailability;
	engine_type: EngineType;
	car_variant_usp: CarVariantUsp[];
	car_variant_product_type: CarVariantProductType[];
	media: Media;
	thumbnail_url: string;
}

export interface Link {
	url: string | null;
	label: string;
	active: boolean;
}

export interface Pagination {
	current_page: number;
	data: Data[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: Link[];
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}

