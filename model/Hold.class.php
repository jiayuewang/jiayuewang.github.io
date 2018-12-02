<?php

class Hold extends DbObject
{
    // name of database table
    const DB_TABLE = 'hold';

    // database fields
    protected $id;
    protected $uid;
    protected $volume;
    protected $symbol;

    // constructor
    public function __construct($args = array())
    {
        $defaultArgs = array(
            'id' => null,
            'uid' => 0,
            'volume' => 0,
            'symbol' => ''
        );

        $args += $defaultArgs;

        $this->id = $args['id'];
        $this->uid = $args['uid'];
        $this->volume = $args['volume'];
        $this->symbol = $args['symbol'];
    }

    // save changes to object
    public function save()
    {
        $db = Db::instance();
        // omit id and any timestamps
        $db_properties = array(
            'id' => $this->id,
            'uid' => $this->uid,
            'volume' => $this->volume,
            'symbol' => $this->symbol
        );
        $db->store($this, __CLASS__, self::DB_TABLE, $db_properties);
    }

    // load object by ID
    public static function loadById($id)
    {
        $db = Db::instance();
        $obj = $db->fetchById($id, __CLASS__, self::DB_TABLE);
        return $obj;
    }

    // load all products
    public static function getHoldsByUserId($userID = null, $limit = null)
    {
        if ($userID == null) {
            return null;
        }

        $query = sprintf(" SELECT id FROM %s WHERE uid = %d",
            self::DB_TABLE,
            $userID
        );
        $db = Db::instance();
        $result = $db->lookup($query);

        if (!mysql_num_rows($result))
            return null;
        else {
            $objects = array();
            while ($row = mysql_fetch_assoc($result)) {
                $objects[] = self::loadById($row['id']);
            }
            return ($objects);
        }
    }


    public static function getHoldBySymbol($userID = null, $symbol = null, $limit = null)
    {
        if ($userID == null) {
            return null;
        }

        $query = sprintf(" SELECT id FROM %s WHERE uid = %d AND symbol = '%s'",
            self::DB_TABLE,
            $userID,
            $symbol
        );
        $db = Db::instance();
        $result = $db->lookup($query);
        if (!mysql_num_rows($result))
            return null;
        else {
//            $objects = array();
//            while($row = mysql_fetch_assoc($result)) {
//                $objects[] = self::loadById($row['id']);
//            }
//            return ($objects);

            $row = mysql_fetch_assoc($result);
//            $obj = new __CLASS__($row);
//            return $obj;
            return $row;
        }
    }


    public static function getHoldsFromViewByUserId($userID = null, $limit = null)
    {
        if ($userID == null) {
            return null;
        }

        $create_view_query = sprintf("CREATE OR REPLACE VIEW holdview AS SELECT hold.id, hold.uid, hold.symbol,hold.volume, company.Security FROM hold JOIN company ON hold.symbol = company.Ticker_symbol"
        );

        $db = Db::instance();
        $db->execute($create_view_query);

        $host     = DB_HOST;
        $database = DB_DATABASE;
        $username = DB_USER;
        $password = DB_PASS;

        $conn = new mysqli($host, $username, $password, $database);

        $stmt = $conn->prepare('SELECT symbol, volume, Security FROM holdview WHERE uid = ?');
        $stmt->bind_param("d", $userID);
        $stmt->execute();
        $stmt->bind_result($col1, $col2, $col3);
        $objects = array();
        while ($stmt->fetch()) {
            $objects[] = array('symbol'=>$col1,'volume'=>$col2,'Security'=>$col3);
        }
        mysqli_stmt_close($stmt);
        return ($objects);

    }

    public static function loadByIdFromView($id)
    {
        $db = Db::instance();
        $obj = $db->fetchByViewId($id, __CLASS__, 'holdview');
        print_r($obj);
        return $obj;
    }



}