const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Region = require("./models/Region");
const Category = require("./models/Category");
const Product = require("./models/Product");

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/vuadacsan");
  console.log("Connected to MongoDB for seeding...");

  // Clear
  await User.deleteMany();
  await Region.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();

  // Users
  const admin = await User.create({ name: "Admin Đức Quyền", email: "admin@vuadacsan.vn", phone: "0912345678", password: "admin123", role: "admin" });
  const cust1 = await User.create({ name: "Nguyễn Văn A", email: "customer@vuadacsan.vn", phone: "0987654321", password: "123456", address: "123 Phố Huế, Hà Nội" });
  const cust2 = await User.create({ name: "Trần Thị B", email: "tranthib@gmail.com", phone: "0909090909", password: "123456", address: "456 Lê Lợi, TP.HCM" });
  console.log("Users seeded");

  // Regions
  const regions = await Region.insertMany([
    { name: "Hà Tĩnh", description: "Đặc sản xứ Nghệ - Hà Tĩnh" },
    { name: "Nghệ An", description: "Vùng đất anh hùng" },
    { name: "Hà Nội", description: "Thủ đô ngàn năm văn hiến" },
    { name: "Đà Nẵng", description: "Thành phố biển xinh đẹp" },
    { name: "Huế", description: "Cố đô Huế" },
    { name: "Sapa", description: "Vùng cao Tây Bắc" },
    { name: "Phú Quốc", description: "Đảo ngọc phương Nam" },
    { name: "Đà Lạt", description: "Thành phố ngàn hoa" },
  ]);
  console.log("Regions seeded");

  // Categories
  const cats = await Category.insertMany([
    { name: "Bánh kẹo", description: "Các loại bánh kẹo đặc sản" },
    { name: "Thực phẩm khô", description: "Khô bò, khô cá, mực khô..." },
    { name: "Nước mắm & Gia vị", description: "Nước mắm, ớt, tương..." },
    { name: "Trái cây sấy", description: "Các loại trái cây sấy khô" },
    { name: "Đồ uống", description: "Trà, cà phê, rượu đặc sản" },
    { name: "Quà biếu", description: "Set quà tặng đặc sản" },
  ]);
  console.log("Categories seeded");

  // Products
  const products = [
    { name: "Kẹo Cu Đơ Hà Tĩnh", description: "Kẹo cu đơ chính gốc Hà Tĩnh, nguyên liệu mật mía, lạc và gừng tươi. Hương vị truyền thống đặc trưng.", price: 85000, stock: 150, region: regions[0]._id, category: cats[0]._id, unit: "Hộp", image: "" },
    { name: "Bánh đa vừng Hà Tĩnh", description: "Bánh đa vừng giòn tan, thơm béo.", price: 45000, stock: 200, region: regions[0]._id, category: cats[0]._id, unit: "Gói", image: "" },
    { name: "Tương Nam Đàn", description: "Tương truyền thống Nam Đàn, Nghệ An. Hương vị đậm đà, ngọt thanh tự nhiên.", price: 65000, stock: 100, region: regions[1]._id, category: cats[2]._id, unit: "Chai", image: "" },
    { name: "Chả rươi Hà Nội", description: "Chả rươi đặc sản Hà Nội, béo ngậy thơm ngon.", price: 120000, stock: 50, region: regions[2]._id, category: cats[1]._id, unit: "Hộp", image: "" },
    { name: "Bún bò Huế ăn liền", description: "Bún bò Huế nguyên liệu tự nhiên, hương vị truyền thống cố đô.", price: 55000, stock: 300, region: regions[4]._id, category: cats[1]._id, unit: "Gói", image: "" },
    { name: "Nước mắm Phú Quốc", description: "Nước mắm nhĩ Phú Quốc 40 độ đạm, thơm nồng đặc trưng.", price: 150000, stock: 120, region: regions[6]._id, category: cats[2]._id, unit: "Chai", image: "" },
    { name: "Cà phê Đà Lạt", description: "Cà phê Arabica Đà Lạt rang mộc, hương thơm dịu nhẹ.", price: 180000, stock: 80, region: regions[7]._id, category: cats[4]._id, unit: "Gói", image: "" },
    { name: "Mực khô Đà Nẵng", description: "Mực một nắng Đà Nẵng tươi ngon, dày thịt.", price: 250000, stock: 60, region: regions[3]._id, category: cats[1]._id, unit: "Kg", image: "" },
    { name: "Trà Shan Tuyết Sapa", description: "Trà shan tuyết cổ thụ vùng cao, vị đậm đà, hậu ngọt.", price: 200000, stock: 40, region: regions[5]._id, category: cats[4]._id, unit: "Hộp", image: "" },
    { name: "Mè xửng Huế", description: "Mè xửng Huế thơm ngon, bánh mỏng giòn xốp.", price: 70000, stock: 180, region: regions[4]._id, category: cats[0]._id, unit: "Hộp", image: "" },
    { name: "Ô mai Hà Nội", description: "Ô mai các loại Hàng Đường, vị truyền thống Hà Nội.", price: 95000, stock: 200, region: regions[2]._id, category: cats[3]._id, unit: "Hộp", image: "" },
    { name: "Khô bò Đà Nẵng", description: "Khô bò miếng Đà Nẵng dai ngon, cay nhẹ.", price: 180000, stock: 90, region: regions[3]._id, category: cats[1]._id, unit: "Gói", image: "" },
    { name: "Set quà Đặc sản miền Trung", description: "Gồm mè xửng, bún bò, mực khô - combo quà biếu.", price: 450000, stock: 30, region: regions[4]._id, category: cats[5]._id, unit: "Set", image: "" },
    { name: "Rượu cần Sapa", description: "Rượu cần truyền thống dân tộc vùng Tây Bắc.", price: 350000, stock: 25, region: regions[5]._id, category: cats[4]._id, unit: "Bình", image: "" },
    { name: "Tiêu Phú Quốc", description: "Tiêu sọ Phú Quốc, hạt đều thơm cay nồng.", price: 120000, stock: 150, region: regions[6]._id, category: cats[2]._id, unit: "Gói", image: "" },
    { name: "Mứt dâu Đà Lạt", description: "Mứt dâu tây Đà Lạt nguyên trái, ngọt dịu.", price: 90000, stock: 100, region: regions[7]._id, category: cats[3]._id, unit: "Hũ", image: "" },
  ];
  await Product.insertMany(products);
  console.log("Products seeded");

  console.log("\n=== SEED COMPLETE ===");
  console.log("Admin: admin@vuadacsan.vn / admin123");
  console.log("Customer: customer@vuadacsan.vn / 123456");
  process.exit();
};

seedDB();