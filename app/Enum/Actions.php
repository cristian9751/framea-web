<?php
namespace App\Enum;
enum Actions: string
{
    case CreateProduct = 'create_product';
    case DeleteProduct = 'delete_product';
    case ModifyProduct = 'modify_product';

    case DeleteUser = 'delete_user';

    case DeleteOrder = 'delete_order';
    case RefundBill = 'refund_bill';
    case ViewOrder = 'view_order';

    case ViewAdministrationPanel = 'view_administration_panel';

    public function Permissions(): array
    {

        return match ($this) {
            self::CreateProduct,
            self::DeleteProduct,
            self::ModifyProduct,
            => [Permission::Product_Management],




            self::DeleteUser,
            => [Permission::User_Management],

            self::DeleteOrder,
            self::RefundBill,
            self::ViewOrder,
            =>[ Permission::Order_Management],

            self::ViewAdministrationPanel =>
                Permission::cases()
        };
    }
}
