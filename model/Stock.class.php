<?php

class Stock extends DbObject {
    // name of database table
    const DB_TABLE = 'price';

    // database fields
    protected $id;
    protected $symbol;
    protected $date;
    protected $open;
    protected $close;
    protected $low;
    protected $high;
    protected $volume;

    // constructor
    public function __construct($args = array()) {
        $defaultArgs = array(
            'id'    => null,
            'symbol'=> '',
            'date'  => null,
            'open'  => 0.0,
            'close' => 0.0,
            'low'   => 0.0,
            'high'  => 0.0,
            'volume'=> 0,
            );

        $args += $defaultArgs;

        $this->id = $args['id'];
        $this->symbol = $args['symbol'];
        $this->date = $args['date'];
        $this->open = $args['open'];
        $this->close= $args['close'];
        $this->low  = $args['low'];
        $this->high = $args['high'];
        $this->volume = $args['volume'];
        
    }

    // load object by ID
    public static function loadById($id) {
        $db = Db::instance();
        $obj = $db->fetchById($id, __CLASS__, self::DB_TABLE);
        return $obj;
    }

    // load stock info by ticker symbol
    public static function getStockBySymbol($symbol=null, $limit=null) {
        if($symbol==null) {
          return null;
        }

        $query = sprintf(" SELECT * FROM %s WHERE symbol = '%s'",
            self::DB_TABLE,
            $symbol
            );
        $db = Db::instance();
        $result = $db->lookup($query);
        if(!mysql_num_rows($result))
            return null;
        else {
            $row = mysql_fetch_assoc($result);
            $class = __CLASS__;
            $obj = new $class($row);
            return ($obj);
        }
    }

    public static function loadByPage($page,$limit,$result) {
        $offset = ($page-1)*$limit;
        $select = array_slice($result,$offset,$limit);
        return $select;
    }
    
        // load stock info by ticker symbol
    public static function getStockByDate($date=null, $limit=null) {
        if($date==null) {
          return null;
        }
        $query = sprintf(" SELECT id FROM %s WHERE date = '$date' LIMIT 30",
            self::DB_TABLE
            );
        $db = Db::instance();
        $result = $db->lookup($query);
        if(!mysql_num_rows($result))
            return null;
        else {
            $objects = array();
            while($row = mysql_fetch_assoc($result)) {
                $objects[] = self::loadById($row['id']);
            }
            return ($objects);
        }
    }

}