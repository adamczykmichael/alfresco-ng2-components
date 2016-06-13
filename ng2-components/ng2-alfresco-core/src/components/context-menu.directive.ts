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

import { Directive, Input } from '@angular/core';
import { ContextMenuService } from './../services/context-menu.service';

@Directive({
    selector:'[context-menu]',
    host: {
        '(contextmenu)':'onShowContextMenu($event)'
    }
})
export class ContextMenuDirective {
    @Input('context-menu')
    links;

    constructor(
        private _contextMenuService: ContextMenuService) {}

    onShowContextMenu(event: MouseEvent) {
        this._contextMenuService.show.next({ event: event, obj: this.links });
        event.preventDefault();
    }
}
