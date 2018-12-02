<?php

class Company extends DbObject {
    // name of database table
    const DB_TABLE = 'company';

    // database fields
    protected $company_id;
    protected $symbol;
    protected $security;
    protected $sec_filings;
    protected $gics_sector;
    protected $gics_sub_industry;
    protected $address;
    protected $data_added;
    protected $cik;

    // constructor
    public function __construct($args = array()) {
        $defaultArgs = array(
            'company_id'=> null,
            'symbol'=> '',
            'security'  => '',
            'sec_filings'  => '',
            'gics_sector' => '',
            'gics_sub_industry' => '',
            'address'  => '',
            'data_added'=> null,
            'cik' => 0
            );

        $args += $defaultArgs;

        $this->company_id = $args['company_id'];
        $this->symbol = $args['symbol'];
        $this->security = $args['security'];
        $this->sec_filings = $args['sec_filings'];
        $this->gics_sector = $args['gics_sector'];
        $this->gics_sub_industry = $args['gics_sub_industry'];
        $this->address  = $args['address'];
        $this->data_added = $args['data_added'];
        $this->cik = $args['cik'];
        
    }

    // load object by ID
    public static function loadById($id) {
        $db = Db::instance();
        $obj = $db->fetchById($id, __CLASS__, self::DB_TABLE);
        return $obj;
    }

    // load stock ticker symbol by company name
    public static function getStockByCompany($security=null, $limit=null) {
        if($security==null) {
          return null;
        }
        $query = sprintf(" SELECT `Ticker_symbol` FROM %s WHERE Security = '%s'",
            self::DB_TABLE,
            $security
            );
        $db = Db::instance();
        $result = $db->lookup($query);
        if(!mysql_num_rows($result))
            return null;
        else {
            $objects = array();
            while($row = mysql_fetch_assoc($result)) {
                $objects[] = $row['Ticker_symbol'];
            }
            return ($objects);
        }
    }

        // load company by stock ticker symbol
        public static function getCompanyByStock($symbol=null, $limit=null) {
            if($symbol==null) {
              return null;
            }
            $query = sprintf(" SELECT * FROM %s WHERE Ticker_symbol = '%s'",
                self::DB_TABLE,
                $symbol
                );
            $db = Db::instance();
            $result = $db->lookup($query);
            if(!mysql_num_rows($result))
                return null;
            else {
                $row = mysql_fetch_assoc($result);
                return ($row);
            }
        }
}