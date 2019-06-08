export default function pct_Client(tx) {
  return tx.executeSql(`CREATE TABLE pct_Client (
        AccuseReception bit NULL
      , AdrFacturation1 nvarchar(36) NULL
      , AdrFacturation2 nvarchar(36) NULL
      , AdrFacturation3 nvarchar(36) NULL
      , AdrLivraison1 nvarchar(36) NULL
      , AdrLivraison2 nvarchar(36) NULL
      , AdrLivraison3 nvarchar(36) NULL
      , AffAdrClientfact bit NULL
      , Assurance bit NULL
      , Banque nvarchar(5) NULL
      , BFA float NULL
      , BlocageCompta smallint NULL
      , CheminDoc nvarchar(100) NULL
      , CheminImage nvarchar(100) NULL
      , Cle nvarchar(2) NULL
      , Code_Agent nvarchar(4) NULL
      , Code_Blocage nvarchar(4) NULL
      , Code_CatClient nvarchar(4) NULL
      , Code_Client nvarchar(8) NOT NULL
      , Code_ClientFacture nvarchar(8) NULL
      , Code_CompteClient nvarchar(10) NULL
      , Code_CritereFact nvarchar(4) NULL
      , Code_Devise nvarchar(4) NULL
      , Code_Origine nvarchar(4) NULL
      , Code_PaysOrigine nvarchar(4) NULL
      , Code_Port nvarchar(4) NULL
      , Code_Reglement nvarchar(4) NULL
      , Code_Remise nvarchar(4) NULL
      , Code_Representant nvarchar(8) NULL
      , Code_Secteur nvarchar(4) NULL
      , Code_statC1 nvarchar(4) NULL
      , Code_statC2 nvarchar(4) NULL
      , Code_statC3 nvarchar(4) NULL
      , Code_statC4 nvarchar(4) NULL
      , Code_statC5 nvarchar(4) NULL
      , Code_Tarif nvarchar(8) NULL
      , Code_Transport nvarchar(4) NULL
      , Code_TVA nvarchar(4) NULL
      , Code_TypeClient nvarchar(4) NULL
      , Code_TypeFacture nvarchar(4) NULL
      , CodeAPE nvarchar(4) NULL
      , CodeTri nvarchar(35) NULL
      , Commentaire nvarchar(120) NULL
      , Commission float NULL
      , Compte nvarchar(11) NULL
      , CPFacturation nvarchar(7) NULL
      , CPLivraison nvarchar(7) NULL
      , DateCreation datetime NULL
      , DateDebFermeture datetime NULL
      , DateFinFermeture datetime NULL
      , DateModif datetime NULL
      , Email1 nvarchar(50) NULL
      , Email2 nvarchar(50) NULL
      , Email3 nvarchar(50) NULL
      , EmailFacturation nvarchar(50) NULL
      , EmailLivraison nvarchar(50) NULL
      , Escompte float NULL
      , FactureFDM bit NULL
      , factureLe25 bit NULL
      , Fax1 nvarchar(20) NULL
      , Fax2 nvarchar(20) NULL
      , Fax3 nvarchar(20) NULL
      , FaxFacturation nvarchar(20) NULL
      , FaxLivraison nvarchar(20) NULL
      , Guichet nvarchar(5) NULL
      , Interlocuteur1 nvarchar(30) NULL
      , Interlocuteur2 nvarchar(30) NULL
      , Interlocuteur3 nvarchar(30) NULL
      , JourQuantiemeReg smallint NULL
      , MontantForfaitPort money NULL
      , MontantFranco money NULL
      , MontantFranco2 money NULL
      , MontMiniRemise money NULL
      , NbFactures smallint NULL
      , NbJourReg smallint NULL
      , NbSalarie smallint NULL
      , NomBanque nvarchar(25) NULL
      , PaysFacturation nvarchar(20) NULL
      , PaysLivraison nvarchar(20) NULL
      , PlafondCredit money NULL
      , QuantiemeReg smallint NULL
      , RaisonSociale nvarchar(40) NULL
      , Releve bit NULL
      , Remise float NULL
      , Service1 nvarchar(50) NULL
      , Service2 nvarchar(50) NULL
      , Service3 nvarchar(30) NULL
      , Siret nvarchar(14) NULL
      , SiteWebFacturation nvarchar(50) NULL
      , Telephone1 nvarchar(20) NULL
      , Telephone2 nvarchar(20) NULL
      , Telephone3 nvarchar(20) NULL
      , TelFacturation nvarchar(20) NULL
      , TelLivraison nvarchar(20) NULL
      , Titre1 nvarchar(4) NULL
      , Titre2 nvarchar(4) NULL
      , Titre3 nvarchar(4) NULL
      , TvaIntra nvarchar(30) NULL
      , VilleFacturation nvarchar(36) NULL
      , VilleLivraison nvarchar(36) NULL
      , ZoneGeographique nvarchar(6) NULL
      , ZoneN1 float NULL
      , ZoneN2 float NULL
      , ZoneN3 float NULL
      , ZoneN4 float NULL
      , ZoneN5 float NULL
      , ZoneT1 nvarchar(40) NULL
      , ZoneT2 nvarchar(40) NULL
      , ZoneT3 nvarchar(40) NULL
      , ZoneT4 nvarchar(40) NULL
      , ZoneT5 nvarchar(40) NULL
      , Code_DepotClient nvarchar(4) NULL
      , nomPoste nvarchar(50) NOT NULL
      )`);
}
