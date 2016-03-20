use myshop;
alter table txn_journal add column txn_date datetime not null;
update txn_journal set txn_date=created;