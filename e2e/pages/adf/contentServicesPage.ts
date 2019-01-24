/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import TestConfig = require('../../test.config');
import { Util } from '../../util/util';
import { ContentListPage } from './dialog/contentListPage';
import { CreateFolderDialog } from './dialog/createFolderDialog';
import { CreateLibraryDialog } from './dialog/createLibraryDialog';
import { NavigationBarPage } from './navigationBarPage';
import { NodeActions } from '../../actions/ACS/node.actions';
import { by, element, protractor, $$, browser } from 'protractor';

import path = require('path');

export class ContentServicesPage {

    contentList = new ContentListPage();
    createFolderDialog = new CreateFolderDialog();
    nodeActions = new NodeActions();
    createLibraryDialog = new CreateLibraryDialog();
    uploadBorder = element(by.id('document-list-container'));
    tableBody = element.all(by.css('adf-document-list div[class="adf-datatable-body"]')).first();
    contentServices = element(by.css('a[data-automation-id="Content Services"]'));
    currentFolder = element(by.css('div[class*="adf-breadcrumb-item adf-active"] div'));
    createFolderButton = element(by.css('button[data-automation-id="create-new-folder"]'));
    createLibraryButton = element(by.css('button[data-automation-id="create-new-library"]'));
    activeBreadcrumb = element(by.css('div[class*="active"]'));
    tooltip = by.css('div[class*="--text adf-full-width"] span');
    uploadFileButton = element(by.css('input[data-automation-id="upload-single-file"]'));
    uploadMultipleFileButton = element(by.css('input[data-automation-id="upload-multiple-files"]'));
    uploadFolderButton = element(by.css('input[data-automation-id="uploadFolder"]'));
    errorSnackBar = element(by.css('simple-snack-bar[class*="mat-simple-snackbar"]'));
    loadMoreButton = element(by.css('button[data-automation-id="adf-infinite-pagination-button"]'));
    emptyPagination = element(by.css('adf-pagination[class*="adf-pagination__empty"]'));
    dragAndDrop = element.all(by.css('adf-upload-drag-area div')).first();
    nameHeader = element(by.css('div[data-automation-id="auto_id_name"] > span'));
    sizeHeader = element(by.css('div[data-automation-id="auto_id_content.sizeInBytes"] > span'));
    createdByHeader = element(by.css('div[data-automation-id="auto_id_createdByUser.displayName"] > span'));
    createdHeader = element(by.css('div[data-automation-id="auto_id_createdAt"] > span'));
    recentFiles = element(by.css('.adf-container-recent'));
    recentFilesExpanded = element(by.css('.adf-container-recent mat-expansion-panel-header.mat-expanded'));
    recentFilesClosed = element(by.css('.adf-container-recent mat-expansion-panel-header'));
    recentFileIcon = element(by.css('.adf-container-recent mat-expansion-panel-header mat-icon'));
    documentListSpinner = element(by.css('mat-progress-spinner'));
    emptyFolder = element(by.css('.adf-empty-folder-this-space-is-empty'));
    emptyFolderImage = element(by.css('.adf-empty-folder-image'));
    emptyRecent = element(by.css('.adf-container-recent .adf-empty-list__title'));
    gridViewButton = element(by.css('button[data-automation-id="document-list-grid-view"]'));
    cardViewContainer = element(by.css('div.adf-document-list-container div.adf-data-table-card'));
    copyButton = element(by.css('button[data-automation-id="content-node-selector-actions-choose"]'));
    searchInputElement = element(by.css('input[data-automation-id="content-node-selector-search-input"]'));
    shareNodeButton = element(by.cssContainingText('mat-icon', ' share '));

    getUploadAreaDocumentList() {
        return new ContentListPage(element(by.css('adf-upload-drag-area')));
    }

    clickFileHyperlink(fileName) {
        let hyperlink = this.contentList.getFileHyperlink(fileName);
        Util.waitUntilElementIsClickable(hyperlink);
        hyperlink.click();
        return this;
    }

    checkFileHyperlinkIsEnabled(fileName) {
        let hyperlink = this.contentList.getFileHyperlink(fileName);
        Util.waitUntilElementIsVisible(hyperlink);
        return this;
    }

    clickHyperlinkNavigationToggle() {
        let hyperlinkToggle = element(by.cssContainingText('.mat-slide-toggle-content', 'Hyperlink navigation'));
        Util.waitUntilElementIsVisible(hyperlinkToggle);
        hyperlinkToggle.click();
        return this;
    }

    getElementsDisplayedCreated() {
        let deferred = protractor.promise.defer();
        let fileCreatedLocator = this.contentList.getColumnLocator('Created');
        Util.waitUntilElementIsVisible(element.all(fileCreatedLocator).first());
        let initialList = [];

        element.all(fileCreatedLocator).each((item) => {
            item.getAttribute('title').then((dateText) => {
                if (dateText !== '') {
                    let date = new Date(dateText);
                    initialList.push(date);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    getElementsDisplayedSize() {
        let deferred = protractor.promise.defer();
        let fileSizeLocator = this.contentList.getColumnLocator('Size');
        Util.waitUntilElementIsVisible(element.all(fileSizeLocator).first());
        let initialList = [];

        element.all(fileSizeLocator).each(function (item) {
            item.getAttribute('title').then((sizeText) => {
                if (sizeText !== '') {
                    let size = Number(sizeText);
                    initialList.push(size);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    getElementsDisplayedAuthor(alfrescoJsApi) {
        let deferred = protractor.promise.defer();
        let idList = this.getElementsDisplayedId();
        let numberOfElements = this.numberOfResultsDisplayed();
        this.nodeActions.getNodesDisplayed(alfrescoJsApi, idList, numberOfElements).then((nodes) => {
            let initialList = [];

            nodes.forEach((item) => {
                if (item.entry.createdByUser.id !== '') {
                    initialList.push(item.entry.createdByUser.id);
                }
            });
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    getElementsDisplayedName() {
        let deferred = protractor.promise.defer();
        let fileNameLocator = this.contentList.getColumnLocator('Display name');
        Util.waitUntilElementIsVisible(element.all(fileNameLocator).first());
        let initialList = [];

        element.all(fileNameLocator).each((item) => {
            item.getText().then(function (name) {
                if (name !== '') {
                    initialList.push(name);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    getElementsDisplayedId() {
        let deferred = protractor.promise.defer();
        let fileIdLocator = this.contentList.getColumnLocator('Node id');
        Util.waitUntilElementIsVisible(element.all(fileIdLocator).first());
        let initialList = [];

        element.all(fileIdLocator).each((item) => {
            item.getText().then(function (text) {
                if (text !== '') {
                    initialList.push(text);
                }
            });
        }).then(function () {
            deferred.fulfill(initialList);
        });

        return deferred.promise;
    }

    checkElementsSortedAsc(elements) {
        let sorted = true;
        let i = 0;
        let compareNumbers = false;

        if (elements && elements[0] && typeof elements[0] === 'number') {
            compareNumbers = true;
        }
        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            const left = compareNumbers ? elements[i] : JSON.stringify(elements[i]);
            const right = compareNumbers ? elements[i + 1] : JSON.stringify(elements[i + 1]);
            if (left > right) {
                sorted = false;
            }
            i++;
        }
        return sorted;
    }

    checkElementsSortedDesc(elements) {
        let sorted = true;
        let i = 0;
        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            if (elements[i] < elements[i + 1]) {
                sorted = false;
            }
            i++;
        }
        return sorted;
    }

    getContentList() {
        return this.contentList;
    }

    checkRecentFileToBeShowed() {
        Util.waitUntilElementIsVisible(this.recentFiles);
    }

    expandRecentFiles() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeClosed();
        this.recentFilesClosed.click();
        this.checkRecentFileToBeOpened();
    }

    closeRecentFiles() {
        this.checkRecentFileToBeShowed();
        this.checkRecentFileToBeOpened();
        this.recentFilesExpanded.click();
        this.checkRecentFileToBeClosed();
    }

    checkRecentFileToBeClosed() {
        Util.waitUntilElementIsVisible(this.recentFilesClosed);
    }

    checkRecentFileToBeOpened() {
        Util.waitUntilElementIsVisible(this.recentFilesExpanded);
    }

    async getRecentFileIcon() {
        await Util.waitUntilElementIsVisible(this.recentFileIcon);
        return this.recentFileIcon.getText();
    }

    checkAcsContainer() {
        Util.waitUntilElementIsVisible(this.uploadBorder);
        return this;
    }

    waitForTableBody() {
        Util.waitUntilElementIsVisible(this.tableBody);
    }

    goToDocumentList() {
        this.clickOnContentServices();
        this.checkAcsContainer();
        return this;
    }

    clickOnContentServices() {
        Util.waitUntilElementIsVisible(this.contentServices);
        Util.waitUntilElementIsClickable(this.contentServices);
        this.contentServices.click();
    }

    navigateToDocumentList() {
        let navigationBarPage = new NavigationBarPage();
        navigationBarPage.clickContentServicesButton();
        this.checkAcsContainer();
    }

    numberOfResultsDisplayed() {
        return this.contentList.getAllDisplayedRows();
    }

    currentFolderName() {
        let deferred = protractor.promise.defer();
        Util.waitUntilElementIsVisible(this.currentFolder);
        this.currentFolder.getText().then(function (result) {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    getTooltip(content) {
        return this.contentList.getRowByRowName(content).element(this.tooltip).getAttribute('title');
    }

    getBreadcrumbTooltip(nodeName: string) {
        return element(by.css(`nav[data-automation-id="breadcrumb"] div[title="${nodeName}"]`)).getAttribute('title');
    }

    getAllRowsNameColumn() {
        return this.contentList.getAllRowsNameColumn();
    }

    sortByName(sortOrder) {
        this.contentList.sortByName(sortOrder);
    }

    sortByAuthor(sortOrder) {
        this.contentList.sortByAuthor(sortOrder);
    }

    sortByCreated(sortOrder) {
        return this.contentList.sortByCreated(sortOrder);
    }

    sortAndCheckListIsOrderedByName(sortOrder) {
        this.sortByName(sortOrder);
        let deferred = protractor.promise.defer();
        this.contentList.checkListIsOrderedByNameColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    async checkListIsSortedByNameColumn(sortOrder) {
        await this.contentList.checkListIsOrderedByNameColumn(sortOrder);
    }

    async checkListIsSortedByCreatedColumn(sortOrder) {
        await this.contentList.checkListIsOrderedByCreatedColumn(sortOrder);
    }

    async checkListIsSortedByAuthorColumn(sortOrder) {
        await this.contentList.checkListIsOrderedByAuthorColumn(sortOrder);
    }

    async checkListIsSortedBySizeColumn(sortOrder) {
        await this.contentList.checkListIsOrderedBySizeColumn(sortOrder);
    }

    sortAndCheckListIsOrderedByAuthor(sortOrder) {
        this.sortByAuthor(sortOrder);
        let deferred = protractor.promise.defer();
        this.contentList.checkListIsOrderedByAuthorColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    sortAndCheckListIsOrderedByCreated(sortOrder) {
        this.sortByCreated(sortOrder);
        let deferred = protractor.promise.defer();
        this.contentList.checkListIsOrderedByCreatedColumn(sortOrder).then((result) => {
            deferred.fulfill(result);
        });
        return deferred.promise;
    }

    navigateToFolder(folder) {
        this.contentList.navigateToFolder(folder);
        return this;
    }

    doubleClickRow(nodeName) {
        this.contentList.doubleClickRow(nodeName);
        return this;
    }

    clickOnCreateNewFolder() {
        Util.waitUntilElementIsVisible(this.createFolderButton);
        this.createFolderButton.click();
        return this;
    }

    openCreateLibraryDialog() {
        Util.waitUntilElementIsVisible(this.createLibraryButton);
        this.createLibraryButton.click();
        this.createLibraryDialog.waitForDialogToOpen();
        return this.createLibraryDialog;
    }

    createNewFolder(folder) {
        this.clickOnCreateNewFolder();
        this.createFolderDialog.addFolderName(folder);
        browser.sleep(200);
        this.createFolderDialog.clickOnCreateButton();
        return this;
    }

    checkContentIsDisplayed(content) {
        this.contentList.checkContentIsDisplayed(content);
        return this;
    }

    checkContentsAreDisplayed(content) {
        for (let i = 0; i < content.length; i++) {
            this.checkContentIsDisplayed(content[i]);
        }
        return this;
    }

    checkContentIsNotDisplayed(content) {
        this.contentList.checkContentIsNotDisplayed(content);
        return this;
    }

    getActiveBreadcrumb() {
        Util.waitUntilElementIsVisible(this.activeBreadcrumb);
        return this.activeBreadcrumb.getAttribute('title');
    }

    uploadFile(fileLocation) {
        this.checkUploadButton();
        Util.waitUntilElementIsVisible(this.uploadFileButton);
        this.uploadFileButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, fileLocation)));
        this.checkUploadButton();
        return this;
    }

    uploadMultipleFile(files) {
        Util.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        let allFiles = path.resolve(path.join(TestConfig.main.rootPath, files[0]));
        for (let i = 1; i < files.length; i++) {
            allFiles = allFiles + '\n' + path.resolve(path.join(TestConfig.main.rootPath, files[i]));
        }
        this.uploadMultipleFileButton.sendKeys(allFiles);
        Util.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        return this;
    }

    uploadFolder(folder) {
        Util.waitUntilElementIsVisible(this.uploadFolderButton);
        this.uploadFolderButton.sendKeys(path.resolve(path.join(TestConfig.main.rootPath, folder)));
        Util.waitUntilElementIsVisible(this.uploadFolderButton);
        return this;
    }

    getSingleFileButtonTooltip() {
        Util.waitUntilElementIsVisible(this.uploadFileButton);
        return this.uploadFileButton.getAttribute('title');
    }

    getMultipleFileButtonTooltip() {
        Util.waitUntilElementIsVisible(this.uploadMultipleFileButton);
        return this.uploadMultipleFileButton.getAttribute('title');
    }

    getFolderButtonTooltip() {
        Util.waitUntilElementIsVisible(this.uploadFolderButton);
        return this.uploadFolderButton.getAttribute('title');
    }

    checkUploadButton() {
        Util.waitUntilElementIsVisible(this.uploadFileButton);
        Util.waitUntilElementIsClickable(this.uploadFileButton);
        return this;
    }

    uploadButtonIsEnabled() {
        return this.uploadFileButton.isEnabled();
    }

    deleteContent(content) {
        this.contentList.deleteContent(content);
        return this;
    }

    getErrorMessage() {
        Util.waitUntilElementIsVisible(this.errorSnackBar);
        let deferred = protractor.promise.defer();
        this.errorSnackBar.getText().then(function (text) {
            deferred.fulfill(text);
        });
        return deferred.promise;
    }

    checkItemInDocList(fileName) {
        Util.waitUntilElementIsVisible(element(by.css(`div[data-automation-id="text_${fileName}"]`)));
    }

    enableInfiniteScrolling() {
        let infiniteScrollButton = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
        Util.waitUntilElementIsVisible(infiniteScrollButton);
        infiniteScrollButton.click();
        return this;
    }

    enableCustomPermissionMessage() {
        let customPermissionMessage = element(by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
        Util.waitUntilElementIsVisible(customPermissionMessage);
        customPermissionMessage.click();
        return this;
    }

    enableMediumTimeFormat() {
        let mediumTimeFormat = element(by.css('#enableMediumTimeFormat'));
        Util.waitUntilElementIsVisible(mediumTimeFormat);
        mediumTimeFormat.click();
        return this;
    }

    enableThumbnails() {
        let thumbnailSlide = element(by.id('adf-thumbnails-upload-switch'));
        Util.waitUntilElementIsVisible(thumbnailSlide);
        thumbnailSlide.click();
        return this;
    }

    clickLoadMoreButton() {
        Util.waitUntilElementIsVisible(this.loadMoreButton);
        Util.waitUntilElementIsClickable(this.loadMoreButton);
        this.loadMoreButton.click();
        return this;
    }

    checkPaginationIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.emptyPagination);
    }

    getDocumentListRowNumber() {
        let documentList = element(by.css('adf-upload-drag-area adf-document-list'));
        Util.waitUntilElementIsVisible(documentList);
        return $$('adf-upload-drag-area adf-document-list .adf-datatable-row').count();
    }

    checkColumnNameHeader() {
        Util.waitUntilElementIsVisible(this.nameHeader);
    }

    checkColumnSizeHeader() {
        Util.waitUntilElementIsVisible(this.sizeHeader);
    }

    checkColumnCreatedByHeader() {
        Util.waitUntilElementIsVisible(this.createdByHeader);
    }

    checkColumnCreatedHeader() {
        Util.waitUntilElementIsVisible(this.createdHeader);
    }

    checkDragAndDropDIsDisplayed() {
        Util.waitUntilElementIsVisible(this.dragAndDrop);
    }

    checkLockIsDisplayedForElement(name) {
        let lockButton = element(by.css(`div.adf-data-table-cell[filename="${name}"] button`));
        Util.waitUntilElementIsVisible(lockButton);
    }

    getColumnValueForRow(file, columnName) {
        let row = this.contentList.getRowByRowName(file);
        Util.waitUntilElementIsVisible(row);
        let rowColumn = row.element(by.css(`div[title="${columnName}"] span`));
        Util.waitUntilElementIsVisible(rowColumn);
        return rowColumn.getText();
    }

    async getStyleValueForRowText(rowName, styleName) {
        let row = element(by.css(`div.adf-data-table-cell[filename="${rowName}"] span.adf-datatable-cell-value[title="${rowName}"]`));
        Util.waitUntilElementIsVisible(row);
        return row.getCssValue(styleName);
    }

    checkSpinnerIsShowed() {
        Util.waitUntilElementIsPresent(this.documentListSpinner);
    }

    checkEmptyFolderTextToBe(text) {
        Util.waitUntilElementIsVisible(this.emptyFolder);
        expect(this.emptyFolder.getText()).toContain(text);
    }

    checkEmptyFolderImageUrlToContain(url) {
        Util.waitUntilElementIsVisible(this.emptyFolderImage);
        expect(this.emptyFolderImage.getAttribute('src')).toContain(url);
    }

    checkEmptyRecentFileIsDisplayed() {
        Util.waitUntilElementIsVisible(this.emptyRecent);
    }

    checkIconForRowIsDisplayed(fileName) {
        let iconRow = element(by.css(`.adf-document-list-container div.adf-data-table-cell[filename="${fileName}"] img`));
        Util.waitUntilElementIsVisible(iconRow);
        return iconRow;
    }

    async getRowIconImageUrl(fileName) {
        let iconRow = this.checkIconForRowIsDisplayed(fileName);
        return iconRow.getAttribute('src');
    }

    checkGridViewButtonIsVisible() {
        Util.waitUntilElementIsVisible(this.gridViewButton);
    }

    clickGridViewButton() {
        this.checkGridViewButtonIsVisible();
        this.gridViewButton.click();
    }

    checkCardViewContainerIsDisplayed() {
        Util.waitUntilElementIsVisible(this.cardViewContainer);
    }

    getCardElementShowedInPage() {
        this.checkCardViewContainerIsDisplayed();
        let actualCards = $$('div.adf-document-list-container div.adf-data-table-card div.adf-cell-value img').count();
        return actualCards;
    }

    getDocumentCardIconForElement(elementName) {
        let elementIcon = element(by.css(`.adf-document-list-container div.adf-data-table-cell[filename="${elementName}"] img`));
        return elementIcon.getAttribute('src');
    }

    checkDocumentCardPropertyIsShowed(elementName, propertyName) {
        let elementProperty = element(by.css(`.adf-document-list-container div.adf-data-table-cell[filename="${elementName}"][title="${propertyName}"]`));
        Util.waitUntilElementIsVisible(elementProperty);
    }

    getAttributeValueForElement(elementName, propertyName) {
        let elementSize = element(by.css(`.adf-document-list-container div.adf-data-table-cell[filename="${elementName}"][title="${propertyName}"] span`));
        return elementSize.getText();
    }

    checkMenuIsShowedForElementIndex(elementIndex) {
        let elementMenu = element(by.css(`button[data-automation-id="action_menu_${elementIndex}"]`));
        Util.waitUntilElementIsVisible(elementMenu);
    }

    navigateToCardFolder(folderName) {
        let folderCard = element(by.css(`.adf-document-list-container div.adf-image-table-cell.adf-data-table-cell[filename="${folderName}"]`));
        folderCard.click();
        let folderSelected = element(by.css(`.adf-datatable-row.adf-is-selected div[filename="${folderName}"].adf-data-table-cell--image`));
        Util.waitUntilElementIsVisible(folderSelected);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    getGridViewSortingDropdown() {
        let sortingDropdown = element(by.css('mat-select[data-automation-id="grid-view-sorting"]'));
        Util.waitUntilElementIsVisible(sortingDropdown);
        return sortingDropdown;
    }

    selectGridSortingFromDropdown(sortingChosen) {
        let dropdownSorting = this.getGridViewSortingDropdown();
        dropdownSorting.click();
        let optionToClick = element(by.css(`mat-option[data-automation-id="grid-view-sorting-${sortingChosen}"]`));
        Util.waitUntilElementIsPresent(optionToClick);
        optionToClick.click();
    }

    checkRowIsDisplayed(rowName) {
        let row = this.contentList.getRowByRowName(rowName);
        Util.waitUntilElementIsVisible(row);
    }

    typeIntoNodeSelectorSearchField(text) {
        Util.waitUntilElementIsVisible(this.searchInputElement);
        this.searchInputElement.sendKeys(text);
    }

    clickContentNodeSelectorResult(name) {
        let resultElement = element.all(by.css(`div[data-automation-id="content-node-selector-content-list"] div[filename="${name}"`)).first();
        Util.waitUntilElementIsVisible(resultElement);
        resultElement.click();
    }

    clickCopyButton() {
        Util.waitUntilElementIsClickable(this.copyButton);
        this.copyButton.click();
    }

    clickShareButton() {
        Util.waitUntilElementIsClickable(this.shareNodeButton);
        this.shareNodeButton.click();
    }
}
