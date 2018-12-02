<?php

include_once 'global.php';

// get the identifier for the page we want to load
$action = $_GET['action'];
// instantiate a ProductController and route it
$pc = new StockController();
$pc->route($action);

class StockController {

	// route us to the appropriate class method for this action

	public function route($action) {
		switch($action) {

			/* This is an example of how to add your page
			case 'stocks':
			$productType = $_GET['ptype'];
			if($productType == 'stock') {
				$this->stock();
			}
			*/

			case 'pricing':
				$stockSymbol = $_GET['symbol']; 
				$this->stock($stockSymbol);
				break;

			case 'deletePost':
				$postID = $_GET['pid'];
				$this->deletePost($postID);
				break;
			

			// redirect to home page if all else fails
			default:
				header('Location: '.BASE_URL);
				exit();
		}

	}

	public function stock($symbol)
    {
		$pageName = 'Pricing';
		$stock = Stock::getStockBySymbol($symbol);
		$company  = Company::getCompanyByStock($symbol);
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/stock_info.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function deletePost($id) {
		session_start();
		$q = "DELETE FROM discussion WHERE id = $id ";
		$db = Db::instance();
		$db->execute($q);

		header('Location: '.BASE_URL.'/discussion/');
	}



}
