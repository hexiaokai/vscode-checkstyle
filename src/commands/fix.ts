import { Uri } from 'vscode';
import * as ls from 'vscode-languageserver-protocol';
import { checkstyleChannel } from '../checkstyleChannel';
import { CheckstyleExtensionCommands } from '../constants/commands';
import { applyWorkspaceEdit } from '../utils/editUtils';
import { handleErrors } from '../utils/errorUtils';
import { executeJavaLanguageServerCommand } from './executeJavaLanguageServerCommand';

export async function fixCheckstyleViolation(uri: Uri, offset: number, sourceName: string): Promise<void> {
    try {
        const workspaceEdit: ls.WorkspaceEdit | undefined = await executeJavaLanguageServerCommand<ls.WorkspaceEdit>(
            CheckstyleExtensionCommands.FIX_CHECKSTYLE_VIOLATION, uri.toString(), offset, sourceName);
        if (!workspaceEdit) {
            checkstyleChannel.appendLine('Unable to get quick fix item from Language Server.');
            return;
        }
        await applyWorkspaceEdit(workspaceEdit);
    } catch (error) {
        handleErrors(error);
    }
}