



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../services/order.service';

@Component({
  standalone: true,
  selector: 'app-raw-material-order',
  templateUrl: './raw-material-order.component.html',
  styleUrls: ['./raw-material-order.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RawMaterialOrderComponent implements OnInit {
  products: any[] = [];

  rawMaterialItems: {
  productId: number | null;
  productName: string;
  rawMaterials: any[];
  rawMaterialId: number | null;
  rawMaterialName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  supplierId: number | null; // ✅ Add this
  supplierName: string; // ✅ Added this

}[] = [
  {
    productId: null,
    productName: '',
    rawMaterials: [],
    rawMaterialId: null,
    rawMaterialName: '',
    unitPrice: 0,
    quantity: 1,
    totalPrice: 0,
    supplierId: null, // ✅ And here
    supplierName: '' // ✅ And here

  }
];


showConfirmation: boolean = false;
confirmationData: any = null;
suppliers: any[] = [];




  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllProducts().subscribe(
      data => {
        console.log('Fetched Products:', data);
        this.products = data;
      },
      error => {
        console.error('Failed to fetch products:', error);
      }
    );
    this.loadSuppliers();


  }


  loadSuppliers(): void {
  this.orderService.getAllSuppliers().subscribe(
    (data: any[]) => {
      this.suppliers = data;
    },
    error => {
      console.error('Error loading suppliers:', error);
    }
  );
}

addRawMaterialToOrder(): void {
  this.rawMaterialItems.push({
    productId: null,
    productName: '',
    rawMaterialId: null,
    rawMaterialName: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    rawMaterials: [],
    supplierId: null, // ✅ Add this here too
    supplierName: '' // ✅ Add this line

  });
}

  removeItem(index: number): void {
    if (this.rawMaterialItems.length > 1) {
      this.rawMaterialItems.splice(index, 1);
    }
  }

onProductChange(index: number): void {
  const item = this.rawMaterialItems[index];

  if (item.productId !== null && item.productId !== undefined) {
    const selectedProduct = this.products.find(p => p.productsId === item.productId);
    if (selectedProduct) {
      item.productName = selectedProduct.productsName;

      this.orderService.getRawMaterialsByProduct(item.productId).subscribe({
        next: (data) => {
          console.log(`Raw materials for productId ${item.productId}:`, data); // ✅ Debug log
          item.rawMaterials = data;
        },
        error: () => item.rawMaterials = []
      });
    } else {
      item.productName = '';
      item.rawMaterials = [];
    }
  } else {
    item.productName = '';
    item.rawMaterials = [];
  }

  // Reset raw material and pricing when product changes
  item.rawMaterialId = null;
  item.rawMaterialName = '';
  item.unitPrice = 0;
  item.quantity = 1;
  item.totalPrice = 0;
}




onRawMaterialChange(index: number): void {
  const item = this.rawMaterialItems[index];

  // ✅ Use component-level rawMaterials
  const selectedRM = item.rawMaterials.find(rm => rm.rwId === item.rawMaterialId);

  if (selectedRM) {
    console.log("Selected Raw Material:", selectedRM);

    item.rawMaterialName = selectedRM.rwName;
    item.unitPrice = selectedRM.rwUnitPrice;

    // ✅ Extract supplierId from selectedRM
    if (selectedRM.supplier && selectedRM.supplier.suppliersId != null) {
      item.supplierId = selectedRM.supplier.suppliersId;
      console.log("Supplier ID bound:", item.supplierId);
    } else {
      console.warn("No supplier found for raw material:", selectedRM);
      item.supplierId = null;
    }
  } else {
    item.rawMaterialName = '';
    item.unitPrice = 0;
    item.supplierId = null;
  }

  this.updateTotalPrice(index);
}






updateTotalPrice(index: number): void {
  const item = this.rawMaterialItems[index];
  item.totalPrice = item.unitPrice * item.quantity;
}

getTotalOrderCost(): number {
  return this.rawMaterialItems.reduce((total, item) => total + (item.totalPrice || 0), 0);
}


submitOrder(): void {
  const payload = {
    items: this.rawMaterialItems.map(item => {
      if (!item.supplierId) {
        alert('Missing supplierId for one or more items');
        throw new Error('Missing supplierId');
      }

      return {
        rwId: item.rawMaterialId,
        quantity: item.quantity,
        supplierId: item.supplierId
      };
    })
  };

  console.log("Final Payload:", payload);

  this.orderService.createRawMaterialOrder(payload).subscribe({
    next: () => alert('Raw material order submitted successfully.'),
    error: (err) => {
      console.error(err);
      alert('Failed to submit order.');
    }
  });
}




  isRawMaterialSelectedElsewhere(rawMaterialId: number, currentIndex: number): boolean {
  return this.rawMaterialItems.some((item, index) =>
    index !== currentIndex && item.rawMaterialId === rawMaterialId
  );
}



// prepareConfirmation(): void {
//   const items = this.rawMaterialItems.map(item => {
//     if (!item.supplierId) {
//       alert('Missing supplierId for one or more items');
//       throw new Error('Missing supplierId');
//     }

//     return {
//       rwId: item.rawMaterialId,
//       rawMaterialName: item.rawMaterialName,
//       quantity: item.quantity,
//       unitPrice: item.unitPrice,
//       totalPrice: item.totalPrice,
//       supplierId: item.supplierId,
//       supplierName: item.supplierName // Make sure this is available
//     };
//   });

//   this.confirmationData = {
//     items,
//     totalCost: this.getTotalOrderCost()
//   };

//   this.showConfirmation = true;
// }




prepareConfirmation(): void {
  const items = this.rawMaterialItems.map(item => {
    if (!item.supplierId) {
      alert('Missing supplierId for one or more items');
      throw new Error('Missing supplierId');
    }

    const supplier = this.suppliers.find(s => s.suppliersId === item.supplierId);
    const supplierName = supplier ? supplier.suppliersName : 'Unknown Supplier';

    return {
      rwId: item.rawMaterialId,
      rawMaterialName: item.rawMaterialName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      supplierId: item.supplierId,
      supplierName: supplierName
    };
  });

  this.confirmationData = {
    items: items,
    totalCost: this.getTotalOrderCost()
  };

  this.showConfirmation = true;
}




confirmOrderSubmission(): void {
  const payload = {
    items: this.confirmationData.items.map((item: any) => ({
      rwId: item.rwId,
      quantity: item.quantity,
      supplierId: item.supplierId
    }))
  };

  this.orderService.createRawMaterialOrder(payload).subscribe({
    next: () => {
      alert('Raw material order submitted successfully.');
      this.showConfirmation = false;
      this.rawMaterialItems = [];
      this.confirmationData = null;
    },
    error: (err) => {
      console.error(err);
      alert('Failed to submit order.');
    }
  });
}

}

