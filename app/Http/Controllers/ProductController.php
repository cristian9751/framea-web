<?php

namespace App\Http\Controllers;

use App\abstract\interfaces\services\IProductService;
use App\dto\CreateProductDTO;
use App\Enum\Actions;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        private readonly IProductService $productService
    )
    {
    }



    public function index() {
        $products = $this->productService->getAll();

        return Inertia::render('ProductTable', ['products' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        if(!Gate::allows(Actions::CreateProduct)) {
            abort(403);
        }
        $validated = $request->validated();


        $newProduct = CreateProductDTO::fromArray($validated);
        $this->productService->save($newProduct);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
