import { extra } from './extra'
import { orders } from './orders'
export const translations = {
  vi: {
    nav: { home: 'Trang chủ', products: 'Sản phẩm', shop: 'Cửa hàng', categories: 'Danh mục', team: 'Đồng phục đội', contact: 'Liên hệ', signIn: 'Đăng nhập', cart: 'Giỏ hàng', menu: 'Mở menu' },
    hero: {
      title: 'Sân là nhà. Trang bị là của bạn.',
      sub: 'Bóng, giày, đồ bảo hộ và đồng phục dành riêng cho người chơi bóng chuyền.',
      cta: 'Mua sắm ngay',
      cta2: 'Đặt đồng phục đội',
      stats: { products: 'Sản phẩm', teams: 'Đội đã trang bị', shipping: 'Giao hàng toàn quốc' },
    },
    categories: {
      title: 'Chọn theo vị trí trên sân',
      items: {
        balls: ['Bóng thi đấu', 'Bóng trong nhà và bãi biển, đạt chuẩn tập luyện.'],
        shoes: ['Giày', 'Bám sân, êm gót, nhảy cao không lo chấn thương.'],
        pads: ['Bảo hộ', 'Băng gối, bó cổ chân, bó khuỷu tay.'],
        apparel: ['Quần áo', 'Áo thoáng khí, nhẹ, co giãn bốn chiều.'],
      },
      view: 'Xem tất cả',
    },
    shop: {
      title: 'Tất cả sản phẩm', search: 'Tìm bóng, giày, áo...', all: 'Tất cả', sort: 'Sắp xếp', category: 'Danh mục', price: 'Mức giá',
      sorts: ['Nổi bật', 'Giá thấp đến cao', 'Giá cao đến thấp'],
      prices: ['Mọi mức giá', 'Dưới 500.000đ', '500.000đ đến 1.500.000đ', 'Trên 1.500.000đ'],
      count: 'sản phẩm', filters: 'Bộ lọc', show: 'Xem kết quả', empty: 'Không tìm thấy sản phẩm phù hợp', emptyHint: 'Thử từ khóa khác hoặc bỏ bớt bộ lọc.', reset: 'Xóa bộ lọc',
    },
    detail: { back: 'Quay lại sản phẩm', qty: 'Số lượng', add: 'Thêm vào giỏ', added: 'Đã thêm vào giỏ', related: 'Có thể bạn cũng thích', notFound: 'Không tìm thấy sản phẩm', decrease: 'Giảm số lượng', increase: 'Tăng số lượng' },
    products: { viewAll: 'Xem tất cả sản phẩm', title: 'Được chọn nhiều tuần này', add: 'Thêm vào giỏ', added: 'Đã thêm', badge: 'Bán chạy' },
    team: {
      title: 'Cả đội một màu, thiết kế theo ý bạn',
      body: 'Gửi logo và số áo, LDVolley lo phần còn lại: in, may và giao đủ cả đội.',
      cta: 'Nhận báo giá',
    },
    footer: {
      about: 'Cửa hàng bóng chuyền dành cho người chơi thật sự.',
      shop: 'Mua sắm', support: 'Hỗ trợ',
      links: { shipping: 'Vận chuyển', returns: 'Đổi trả', size: 'Hướng dẫn chọn size', contact: 'Liên hệ' },
      rights: 'Bảo lưu mọi quyền.',
    },
  },
  en: {
    nav: { home: 'Home', products: 'Products', shop: 'Shop', categories: 'Categories', team: 'Team kits', contact: 'Contact', signIn: 'Sign in', cart: 'Cart', menu: 'Open menu' },
    hero: {
      title: 'The court is home. The gear is yours.',
      sub: 'Balls, shoes, protection and team kits made for volleyball players.',
      cta: 'Shop now',
      cta2: 'Order team kits',
      stats: { products: 'Products', teams: 'Teams equipped', shipping: 'Nationwide delivery' },
    },
    categories: {
      title: 'Shop by position on court',
      items: {
        balls: ['Match balls', 'Indoor and beach balls built to training standards.'],
        shoes: ['Shoes', 'Grippy, cushioned heels for high, safe jumps.'],
        pads: ['Protection', 'Knee pads, ankle braces and elbow sleeves.'],
        apparel: ['Apparel', 'Light, breathable, four-way stretch jerseys.'],
      },
      view: 'View all',
    },
    shop: {
      title: 'All products', search: 'Search balls, shoes, jerseys...', all: 'All', sort: 'Sort by', category: 'Category', price: 'Price',
      sorts: ['Featured', 'Price: low to high', 'Price: high to low'],
      prices: ['Any price', 'Under 500,000đ', '500,000đ to 1,500,000đ', 'Over 1,500,000đ'],
      count: 'products', filters: 'Filters', show: 'Show results', empty: 'No matching products', emptyHint: 'Try another keyword or clear some filters.', reset: 'Clear filters',
    },
    detail: { back: 'Back to products', qty: 'Quantity', add: 'Add to cart', added: 'Added to cart', related: 'You may also like', notFound: 'Product not found', decrease: 'Decrease quantity', increase: 'Increase quantity' },
    products: { viewAll: 'View all products', title: 'Most picked this week', add: 'Add to cart', added: 'Added', badge: 'Best seller' },
    team: {
      title: 'One team, one colour, your design',
      body: 'Send your logo and numbers. LDVolley prints, sews and delivers for the whole roster.',
      cta: 'Get a quote',
    },
    footer: {
      about: 'A volleyball store for people who actually play.',
      shop: 'Shop', support: 'Support',
      links: { shipping: 'Shipping', returns: 'Returns', size: 'Size guide', contact: 'Contact' },
      rights: 'All rights reserved.',
    },
  },
}

for (const l of ['vi', 'en']) Object.assign(translations[l], extra[l], orders[l])