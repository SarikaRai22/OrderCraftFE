import { Component, OnInit } from '@angular/core';
import { ProductCategorizationService, Product, Category, ProductDTO, CategoryDTO } from '../../../services/product-categorization.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // ✅ import AuthService

@Component({
  selector: 'app-product-categorization',
  templateUrl: './product-categorization.component.html',
  styleUrls: ['./product-categorization.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ProductCategorizationComponent implements OnInit {

  categories: Category[] = [];
  products: Product[] = [];

  // For category form
  newCategoryName: string = '';

  // For product form
  newProduct: ProductDTO = {
  productsName: '',
  productsDescription: '',
  unitPrice: null ,
  quantity:null,
  image: '',
  categoryId: undefined,
  newCategoryName: ''
};

  selectedCategoryId: number | null = null;

  constructor(
    private service: ProductCategorizationService,
    private authService: AuthService   // ✅ inject AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  /** ===== CATEGORY ===== */
  loadCategories() {
    this.service.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  addCategory() {
    if (!this.canManageInventory()) return; // ✅ role check
    if (!this.newCategoryName.trim()) return;

    const dto: CategoryDTO = { categoryName: this.newCategoryName };
    this.service.addCategory(dto).subscribe(saved => {
      this.categories.push(saved);
      this.newCategoryName = '';
    });
  }

  deleteCategory(categoriesId: number) {
    if (!this.canManageInventory()) return; // ✅ role check

    this.service.deleteCategory(categoriesId).subscribe(() => {
      this.categories = this.categories.filter(c => c.categoriesId !== categoriesId);
      if (this.selectedCategoryId === categoriesId) {
        this.selectedCategoryId = null;
        this.loadProducts();
      }
    });
  }

  /** ===== PRODUCT ===== */
  loadProducts() {
    if (this.selectedCategoryId) {
      this.service.getProductsByCategory(this.selectedCategoryId).subscribe(res => this.products = res);
    } else {
      this.service.getAllProducts().subscribe(res => this.products = res);
    }
  }

  addProduct() {
    if (!this.canManageInventory()) return; // ✅ role check
    if (!this.newProduct.productsName || (!this.newProduct.categoryId && !this.newProduct.newCategoryName)) {
      return;
    }

    this.service.addProduct(this.newProduct).subscribe(saved => {
      this.products.push(saved);
      this.newProduct = {
        productsName: '',
        productsDescription: '',
        unitPrice: null,
        quantity: null,
        image: '',
        categoryId: undefined,
        newCategoryName: ''
      };
    });
  }

  deleteProduct(productsId: number) {
    if (!this.canManageInventory()) return; // ✅ role check

    this.service.deleteProduct(productsId).subscribe(() => {
      this.products = this.products.filter(p => p.productsId !== productsId);
    });
  }

  /** ===== ROLE CHECK ===== */
  canManageInventory(): boolean {
    return this.authService.hasRole("IM"); // ✅ will return true if user has ROLE_IM
  }
  confirmDeleteCategory(categoriesId: number) {
  if (confirm("⚠️ Are you sure you want to delete this category?")) {
    this.deleteCategory(categoriesId);
  }
}

confirmDeleteProduct(productsId: number) {
  if (confirm("⚠️ Are you sure you want to delete this product?")) {
    this.deleteProduct(productsId);
  }
}

}
