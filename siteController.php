<?php
include_once 'global.php';
// get the identifier for the page we want to load
$action = $_GET['action'];
// instantiate a SiteController and route it
$pc = new SiteController();
$pc->route($action);

class SiteController
{
    // route us to the appropriate class method for this action
    public function route($action)
    {
        session_start();
        if ($action != 'login' && $action != 'processLogin' && $action != 'welcome' && !isset($_SESSION['user'])) $action = 'loginprompt';
        switch ($action) {
            case 'welcome':
                $this->welcome();
                break;
            case 'login':
                $this->login();
                break;
            case 'processLogin':
                $username = $_POST['un'];
                $password = $_POST['pw'];
                $this->processLogin($username, $password);
                break;
            case 'processLogout':
                $this->processLogout();
                break;
            case 'home':
                $this->home();
                break;
            case 'membership':
                $this->membership();
                break;
            case 'market':
                $this->market();
                break;
            case 'discussion':
                $this->discussion();
                break;
            case 'trade':
                $this->trade();
                break;
            case 'loginprompt':
                $this->loginprompt();
                break;
            case 'transaction':
                $this->transaction();
                break;

            case 'prediction':
                $this->prediction();
                break;

            case 'profile':
                $this->profile();
                break;
            case 'editProcess':
                $this->editProcess();
                break;
            case 'edit':
                $this->edit();
                break;
            case 'post':
                $this->post();
                break;
            case 'postProcess':
                $this->postProcess();
                break;

            case 'tradeProcess':
                $this->tradeProcess();
                break;

            case 'membershipChange':
                $this->membershipChange();
                break;

            // redirect to home page if all else fails
            default:
                header('Location: ' . BASE_URL);
                exit();
        }
    }

    public function welcome()
    {
        $pageName = 'Welcome';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/welcome.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function home()
    {
        $pageName = 'Home';
        $holdings = Hold::getHoldsFromViewByUserId($_SESSION['id']);
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/home.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function login()
    {
        $pageName = 'Login';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/login.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function membership()
    {
        $pageName = 'Membership';
        $user = User::loadById($_SESSION['id']);
        $member = '';
        if ($user->get('perm') == 1) $member = 'Trade';
        else $member = 'Prime';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/membership.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function market()
    {
        $pageName = 'Market';
        $stocks = Stock::getStockByDate("2016-08-05");
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/market.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function discussion()
    {
        $pageName = 'Discussion';
        $result = Discussion::getAllDiscussion();
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/discussion.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function processLogin($u, $p)
    {
        $db = Db::instance();
        $q = "SELECT * FROM user WHERE username = '$u'; ";
        $result = mysql_query($q);
        if (!$result) {
            die("Incorrect username or password.");
            exit();
        } else {
            $adminUsername = '';
            $adminPassword = '';
            $id = 0;
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
                $adminUsername = $row["username"];
                $adminPassword = $row["password"];
                $id = $row["id"];
            }
            if (($u == $adminUsername) && ($p == $adminPassword)) {
                session_start();
                $_SESSION['user'] = $u;
                $_SESSION['id'] = $id;
                header('Location: ' . BASE_URL);
                exit();
            } else {
                $message = "Incorrect username or password.";
                //pop up the aleat message
                echo "<script type='text/javascript'>alert('$message');</script>";
            }
        }
        $pageName = 'Login';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/login.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function processLogout()
    {
        session_start();
        session_unset();
        header('Location: ' . BASE_URL);
        exit();
    }

    public function trade()
    {
        $pageName = 'Trade';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/trade.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function loginprompt()
    {
        $pageName = 'Login Required';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/redirect.html';
    }

    public function transaction()
    {
        $pageName = 'Transaction';
        $transactions = Transaction::getTransactionsByUserId($_SESSION['id']);
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/transaction.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function prediction()
    {
        $pageName = 'Prediction';
        $prediction = Transaction::getPrediction();
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/prediction.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function edit()
    {
        $pageName = 'Edit';
        $user = User::loadById($_SESSION['id']);
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/edit.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function profile()
    {

        $user = User::loadById($_SESSION['id']);
        $member = '';
        if ($user->get('perm') == 1) $member = 'Trade';
        else $member = 'Prime';

        $pageName = 'Profile';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/user_profile.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function editProcess()
    {
        $p = User::loadById($_SESSION['id']);

        $p->set('password', $_POST['pw']);
        $p->set('email', $_POST['email']);
        $p->set('first_name', $_POST['fname']);
        $p->set('last_name', $_POST['lname']);
        $p->set('bank_account', $_POST['bank']);
        $p->save();

        session_start();
        echo "<script>var baseURL ='".BASE_URL."'</script>"; 
        echo "<script>
        alert('You edited your profile.');
        window.location.href= baseURL + '/profile/';
        </script>";
    }

    public function post()
    {
        $pageName = 'New Post';
        include_once SYSTEM_PATH . '/view/header.html';
        include_once SYSTEM_PATH . '/view/newpost.html';
        include_once SYSTEM_PATH . '/view/footer.html';
    }

    public function postProcess()
    {
        $db = Db::instance();
        $data = array(
            'id' => null,
            'title' => $_POST['title'],
            'content' => $_POST['content'],
            'uid' => $_SESSION['id']
        );

        $q = $db->buildInsertQuery('discussion', $data);
        $db->execute($q);

        $_SESSION['msg'] = "Successfully Posted! ";
        header('Location: ' . BASE_URL . '/discussion/');
    }

    public function tradeProcess()
    {
        $db = Db::instance();
        if ($_POST['buyorsell'] == "Buy") {
            $data = array(
                'id' => null,
                'symbol' => $_POST['tradetickersymbol'],
                'volume' => $_POST['quantity'],
                'price' => $_POST['price'],
                'uid' => $_SESSION['id'],
                'buyorsell' => 1
            );


            $currentHold = Hold::getHoldBySymbol($_SESSION['id'], $_POST['tradetickersymbol']);
            if ($currentHold == null) {
                $data2 = array(
                    'id' => null,
                    'symbol' => $_POST['tradetickersymbol'],
                    'volume' => $_POST['quantity'],
                    'uid' => $_SESSION['id'],
                );
                $q2 = $db->buildInsertQuery('hold', $data2);
                $db->execute($q2);
            } else {
                $p = Hold::loadById($currentHold['id']);
                $updatedVolume = $p->get('volume') + $_POST['quantity'];

                $p->set('volume', $updatedVolume);
                $p->save();

//                header('Location: ' . BASE_URL);

            }

            $q1 = $db->buildInsertQuery('transaction', $data);
            $db->execute($q1);
            $_SESSION['msg'] = "Trade Successfully Made! ";

            header('Location: ' . BASE_URL);

        } else if ($_POST['buyorsell'] == "Sell") {

            $currentHold = Hold::getHoldBySymbol($_SESSION['id'], $_POST['tradetickersymbol']);
            if ($currentHold == null) {

                echo "<script>var baseURL ='".BASE_URL."'</script>";
                echo "<script>
                alert('You are not holding this stock!');
                window.location.href= baseURL;
                </script>";
            } else {
                $p = Hold::loadById($currentHold['id']);
                if ($p->get('volume') < $_POST['quantity']) {

                    //pop out error message
                    echo "<script>var baseURL ='".BASE_URL."'</script>";
                    echo "<script>
                    alert('You are not holding enough this stock!');
                    window.location.href= baseURL;
                    </script>";
                } else {

                    $data = array(
                        'id' => null,
                        'symbol' => $_POST['tradetickersymbol'],
                        'volume' => $_POST['quantity'],
                        'price' => $_POST['price'],
                        'uid' => $_SESSION['id'],
                        'buyorsell' => -1
                    );


                    $q1 = $db->buildInsertQuery('transaction', $data);
                    $db->execute($q1);


                    $p = Hold::loadById($currentHold['id']);
                    $updatedVolume = $p->get('volume') - $_POST['quantity'];

                    $p->set('volume', $updatedVolume);
                    $p->save();

                    $_SESSION['msg'] = "Trade Successfully Made! ";
                    header('Location: ' . BASE_URL);


                }
            }
        }

        $drop_view_query = sprintf("DROP VIEW IF EXISTS holdview"
        );

        $db = Db::instance();
        $db->execute($drop_view_query);


    }

    public
    function membershipChange()
    {
        $p = User::loadById($_SESSION['id']);

        $p->set('perm', $_POST['membership']);
        $p->save();
        session_start();
        header('Location: ' . BASE_URL . '/membership/');

    }


}
